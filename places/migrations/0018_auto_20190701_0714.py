# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-07-01 07:14
from __future__ import unicode_literals

from django.db import migrations, models
import places.models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0017_auto_20190630_2242'),
    ]

    operations = [
        migrations.AlterField(
            model_name='load',
            name='password',
            field=models.CharField(blank=True, default='1234', max_length=4, null=True, validators=[places.models.validate_password]),
        ),
    ]
