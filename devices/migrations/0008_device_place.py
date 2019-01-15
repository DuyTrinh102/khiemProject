# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-01-03 17:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0003_remove_place_devices'),
        ('devices', '0007_auto_20181225_0717'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='place',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='devices', to='places.Place'),
            preserve_default=False,
        ),
    ]