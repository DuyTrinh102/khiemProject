# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-01-12 18:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0005_load'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='load_main',
            field=models.BooleanField(default=False),
        ),
    ]
