# Generated by Django 5.1.4 on 2025-01-10 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('healthcare', '0002_patient_gender_patient_insurance_number_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='phone_number',
            field=models.CharField(default='74957556983', max_length=11),
        ),
    ]
