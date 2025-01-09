from django.db import models

# Create your models here.
class Patient(models.Model):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    patronym = models.CharField(max_length=120)
    birth_date = models.DateField()