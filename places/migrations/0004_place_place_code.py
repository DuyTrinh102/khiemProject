# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-01-12 00:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0003_remove_place_devices'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='place_code',
            field=models.CharField(max_length=50, null=True, unique=True),
        ),
    ]
