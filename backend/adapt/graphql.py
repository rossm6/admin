from dataclasses import make_dataclass, field
import string
from strawberry.tools import create_type
import strawberry
from typing import List
from enum import Enum
from strawberry_django_plus.optimizer import DjangoOptimizerExtension
import re
from django.db.models import Field
from django import forms
import uuid
import decimal
import datetime
from typing import Optional
from strawberry import auto
from strawberry_django_plus import gql
from dummy import models as dummy_models
import stringcase


'''

Limitations -

All forms must be able to work when instantiated without any args or kwargs.
This is because we get all form fields by calling the constructor without passing anything
(Unlike django models I can't see anything in the django api for getting form fields)

'''


FORM_FIELD_TYPE_MAP = {
    forms.fields.BooleanField: bool,
    forms.fields.CharField: str,
    forms.fields.DateField: datetime.date,
    forms.fields.DateTimeField: datetime.datetime,
    forms.fields.DecimalField: decimal.Decimal,
    forms.fields.EmailField: str,
    forms.fields.FilePathField: str,
    forms.fields.FloatField: float,
    forms.fields.GenericIPAddressField: str,
    forms.fields.IntegerField: int,
    forms.fields.NullBooleanField: Optional[bool],
    forms.fields.SlugField: str,
    forms.fields.TimeField: datetime.time,
    forms.fields.URLField: str,
    forms.fields.UUIDField: uuid.UUID,
    forms.models.ModelChoiceField: strawberry.ID,
    forms.fields.TypedChoiceField: str,
    forms.models.ModelMultipleChoiceField: List[strawberry.ID]
}

def get_form_fields(form_instance):
    return form_instance.base_fields.items()

def get_all_fields_from_form(form_class):
    form_instance = form_class()
    fields = []
    items = get_form_fields(form_instance)
    # push optional items to the end of the list.
    # we will assign them "None" value, so they should be placed after
    # attrs with no default values
    sorted_items = sorted(items, key=lambda x: x[1].required, reverse=True)
    for item in sorted_items:
        item_name = item[0]
        item_value = item[1]
        field_tuple = (item_name, )
        # set default value to None for Optional types
        if not item_value.required:
            field_tuple = field_tuple + (
                Optional[FORM_FIELD_TYPE_MAP[type(item_value)]],
                field(default=None),)
        else:
            field_tuple = field_tuple + (
                FORM_FIELD_TYPE_MAP[type(item_value)],)
        fields.append(field_tuple)

    # ModelForm instances should have id attr even if it's not present
    # in model form instance by default
    if issubclass(form_class, forms.ModelForm):
        fields.append(('id', Optional[strawberry.ID], field(default=None)))
    return fields

from django.utils.functional import Promise
from django.utils.encoding import force_str
from strawberry.utils.str_converters import to_camel_case

def _camelize_django_str(s):
    if isinstance(s, Promise):
        s = force_str(s)
    return to_camel_case(s) if isinstance(s, str) else s

def isiterable(value):
    try:
        iter(value)
    except TypeError:
        return False
    return True

def camelize(data):
    if isinstance(data, dict):
        return {_camelize_django_str(k): camelize(v) for k, v in data.items()}
    if isiterable(data) and not isinstance(data, (str, Promise)):
        return [camelize(d) for d in data]
    return data

@strawberry.type
class ErrorType:
    field: str
    messages: List[str]

    @classmethod
    def from_errors(cls, errors):
        data = camelize(errors)
        return [cls(field=key, messages=value) for key, value in data.items()]

@strawberry.interface
class BaseMutationResponseType:
    errors: Optional[List[ErrorType]]

def create_default_model_form(model):
    meta_cls = type("Meta", (), {"model": model, "fields": "__all__"})
    return type(f'Default{model.__name__}', (forms.ModelForm,), {"Meta": meta_cls})

def get_mutation_field_from_model(model, model_gql, form):

    form_input_name = f'default_{model.__name__}_input'

    FormInputDataclass = make_dataclass(
        form_input_name,
        fields=get_all_fields_from_form(form),
    )
    FormInputDataclass.__doc__ = None

    FormInput = strawberry.input(FormInputDataclass)

    form_response_name = f'default_{model.__name__}_response'

    FormResponseDataclass = make_dataclass(
            form_response_name,
            fields=[
                ("response", Optional[model_gql]),
            ],
            bases=(BaseMutationResponseType,),
        )

    FormResponseDataclass.__doc__ = None

    FormResponse = strawberry.type(FormResponseDataclass)

    def resolver(info, input: FormInput) -> FormResponse:
        return FormResponse()

    return strawberry.mutation(name=f'{model.__name__.lower()}_default', resolver=resolver)


def create_choices_field_from_forms(forms):
    # TODO - dynamically create a object type
    # where we resolve the fields on the object
    # See - https://strawberry.rocks/docs/types/resolvers#accessing-fields-parents-data
    return None


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

@strawberry.type
class Form:
    mutation_name: str
    choice_fields: List[str]


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

def get_model_gql_types(models, model_types):

    for model in models:
        model_type_name = f'{model.__name__}Type'
        model_type = gql.django.type(model)
        model_gql_type = model_type(make_dataclass(model_type_name, [("id", str)]))
        model_types[model.__name__] = model_gql_type
        
        for field in model._meta.get_fields():
            if field.related_model and isinstance(field, Field):
                related_model = field.related_model
                if related_model.__name__ in model_types:
                    ...
                else:
                    get_model_gql_types([related_model], model_types)
                setattr(model_gql_type, field.name, model_types[related_model.__name__])
            else:
                setattr(model_gql_type, field.name, auto)
        
    return model_types


def get_choice_fields_from_form(form):
    choices = []
    form_instance = form()
    for field_name, field in get_form_fields(form_instance):
        if isinstance(field, (forms.TypedChoiceField, forms.ModelChoiceField, forms.ModelMultipleChoiceField)):
            choices.append(field_name)
    return choices

def register(django_models):

    django_model_enums = Enum(
        "django_models", dict([(stringcase.snakecase(django_model.__name__), django_model.__name__) for django_model in django_models])
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

    model_types = get_model_gql_types(django_models, {})        

    default_django_model_form_fields = []
    forms = []
    for_choices_query = []
    for model in django_models:
        default_model_form = create_default_model_form(model)
        mutation_field = get_mutation_field_from_model(model, model_types[model.__name__], default_model_form)
        forms.append((mutation_field.graphql_name, default_model_form))
        default_django_model_form_fields.append(mutation_field)

    Mutation = create_type(
        "Mutation", 
        default_django_model_form_fields
    )

    choices_field = create_choices_field_from_forms(forms)

    def get_forms() -> List[Form]:
        return [
            Form(mutation_name=mutation_name, choice_fields=get_choice_fields_from_form(form))
            for mutation_name, form in forms
        ]

    forms_field = strawberry.field(name="forms", resolver=get_forms)

    # TODO - add choices field
    Query = create_type("Query", [forms_field, models, table])

    return {
        "query": Query,
        "schema": strawberry.Schema(
            extensions=[DjangoOptimizerExtension],
            query=Query,
            mutation=Mutation
        )
    }