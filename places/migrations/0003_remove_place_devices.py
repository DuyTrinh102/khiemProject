# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-01-03 17:08
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0002_place_devices'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='place',
            name='devices',
        ),
    ]