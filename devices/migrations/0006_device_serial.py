# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-12-25 00:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0005_auto_20181225_0056'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='serial',
            field=models.CharField(default=1, max_length=50, unique=True),
            preserve_default=False,
        ),
    ]