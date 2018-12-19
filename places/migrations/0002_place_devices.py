# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-12-02 08:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0004_remove_device_place'),
        ('places', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='devices',
            field=models.ManyToManyField(to='devices.Device'),
        ),
    ]
