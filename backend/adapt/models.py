from django.db import models

class Adapt(models.Model):
    state = models.JSONField()
