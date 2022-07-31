from django.contrib import admin
from adapt.graphql import register
from dummy.models import Person

admin.site.register(Person)
schema = register([Person])["schema"]