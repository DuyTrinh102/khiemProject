# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-12-25 00:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0006_device_serial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='device',
            name='device_measure_data',
            field=models.ManyToManyField(blank=True, to='devices.DataMeasure'),
        ),
    ]
