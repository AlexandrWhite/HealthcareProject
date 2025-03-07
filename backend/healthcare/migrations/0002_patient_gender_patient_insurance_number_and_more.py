# Generated by Django 5.1.4 on 2025-01-09 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('healthcare', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='gender',
            field=models.CharField(default='муж', max_length=3),
        ),
        migrations.AddField(
            model_name='patient',
            name='insurance_number',
            field=models.CharField(default='000-000-000 00', max_length=14),
        ),
        migrations.AddField(
            model_name='patient',
            name='living_adress',
            field=models.CharField(default='г. Оренбург, просп. Победы, д. 13', max_length=120),
        ),
        migrations.AddField(
            model_name='patient',
            name='registration_adress',
            field=models.CharField(default='г. Оренбург, просп. Победы, д. 13', max_length=120),
        ),
        migrations.AddField(
            model_name='patient',
            name='social_status',
            field=models.CharField(default='работает', max_length=120),
        ),
    ]
