from strawberry.tools import create_type
import strawberry
from typing import List
from enum import Enum
from strawberry_django_plus.optimizer import DjangoOptimizerExtension
import re
from django.db.models import Field

@strawberry.type
class Column:
    name: str
    model: str
    field: str
    related_models: List[str]


@strawberry.type
class Row:
    cursor: str
    cellValues: List[str]


@strawberry.type
class Table:
    columns: List["Column"]
    rows: List["Row"]

def is_many_to_one_relation(model):
    """
    There is a bug, at least odd behaviour, which means
    the many_to_one property will give us false for a many to one field!
    See - https://github.com/django/django/blob/main/django/db/models/fields/reverse_related.py#L241
    """

    try:
        return model.many_to_one == False and model.one_to_many == True
    except AttributeError:
        return False


def get_related_field_name(related_field):
    try:
        # Special case here
        # This is for a One to One relation
        return related_field.field.name
    except AttributeError:
        # This is for anything other than One to One
        return related_field.name


def get_columns_from_django_model(model, related_models, path):
    columns = []

    fields = model._meta.get_fields()

    for field in fields:
        if related_model := field.related_model:
            if (
                isinstance(field, Field)
                and not field.many_to_many
                and related_model not in related_models
            ):
                columns = columns + get_columns_from_django_model(
                    related_model, 
                    related_models=related_models + [related_model],
                    path=path + [get_related_field_name(field)]
                )
        else:
            column = {
                "name": field.name, 
                "model": model.__name__,
                "field": "__".join(path + [field.name]),
                "related_models": [ related_model.__name__ for related_model in related_models]
            }
            columns.append(column)

    return columns

def to_snake_case(name):
    return re.sub(r'(?<!^)(?=[A-Z])', '_', name).lower()

def register(django_models):

    django_model_enums = Enum(
        "django_models", dict([(to_snake_case(django_model.__name__), django_model.__name__) for django_model in django_models])
    )

    strawberry.enum(django_model_enums)

    '''
    TODO -
    Introduce a perms system for particular models
    and even columns on the models
    '''

    def get_models() -> List[django_model_enums]:
        return [
            enum
            for enum in django_model_enums
        ]

    def get_table(model: django_model_enums) -> Table:

        for django_model in django_models:
            if django_model.__name__ == model:
                break
        
        columns = get_columns_from_django_model(django_model, [], [])

        objs = django_model.objects.all().values_list(*[column["field"] for column in columns])

        return Table(
            columns=[Column(**column) for column in columns], 
            rows=[ 
                Row(**{ 
                    "cursor": "todo", 
                    "cellValues": [str(value) for value in obj ]
                }) 
                for obj in objs 
            ]
        )

    models = strawberry.field(name="models", resolver=get_models)
    table = strawberry.field(name="table", resolver=get_table)

    Query = create_type("Query", [models, table])

    return {
        "query": Query,
        "schema": strawberry.Schema(
            extensions=[DjangoOptimizerExtension],
            query=Query
        )
    }