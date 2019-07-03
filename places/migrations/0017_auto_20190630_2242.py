# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-06-30 22:42
from __future__ import unicode_literals

from django.db import migrations, models
import places.models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0016_load_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='load',
            name='password',
            field=models.CharField(blank=True, max_length=4, null=True, validators=[places.models.validate_password]),
        ),
    ]