# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-01-15 06:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0011_auto_20190112_1342'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datameasure',
            name='value',
            field=models.FloatField(),
        ),
    ]
