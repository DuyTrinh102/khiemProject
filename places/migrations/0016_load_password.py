# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-06-30 20:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0015_auto_20190630_1830'),
    ]

    operations = [
        migrations.AddField(
            model_name='load',
            name='password',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]