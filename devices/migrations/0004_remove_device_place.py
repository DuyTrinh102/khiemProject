# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-12-02 08:00
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0003_auto_20181202_1449'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='device',
            name='place',
        ),
    ]
