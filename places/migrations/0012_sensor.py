# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-04-13 13:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0011_auto_20190413_1034'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sensor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serial', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=50)),
                ('type_display', models.PositiveIntegerField(choices=[(0, 'Warning'), (1, 'Display')], default=0)),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sensors', to='places.Place')),
            ],
        ),
    ]
