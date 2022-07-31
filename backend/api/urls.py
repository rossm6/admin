from api.schema import schema
from django.urls import path
from strawberry.django.views import GraphQLView

urlpatterns = [path("graphql", GraphQLView.as_view(schema=schema))]