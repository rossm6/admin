from django.db import models

class Address(models.Model):
    post_code = models.CharField(max_length=6)

class Work(models.Model):
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    
class Person(models.Model):
    genders = [
        ("m", "Male"),
        ("f", "Female"),
    ]
    name = models.CharField(max_length=255)
    age = models.CharField(max_length=3)
    gender = models.CharField(choices=genders, max_length=1)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    work = models.ForeignKey(Work, on_delete=models.SET_NULL, null=True, blank=True)
    friends = models.ManyToManyField("self")
    spouse = models.OneToOneField("self", on_delete=models.SET_NULL, null=True, blank=True)