# Generated by Django 5.1.4 on 2025-01-09 04:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=120)),
                ('last_name', models.CharField(max_length=120)),
                ('patronym', models.CharField(max_length=120)),
                ('birth_date', models.DateField()),
            ],
        ),
    ]
