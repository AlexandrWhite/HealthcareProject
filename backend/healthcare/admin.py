from django.contrib import admin
from .models import Patient

# Register your models here.
class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name', 'patronym', 'birth_date')

admin.site.register(Patient, PatientAdmin)