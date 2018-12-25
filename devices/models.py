# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


# class DeviceType(models.Model):
# 	device_type = models.CharField(max_length=50, unique=True)
# 	device_unit = models.CharField(max_length=50, verbose_name="Measure unit")


class DataMeasure(models.Model):
	value = models.FloatField()
	receive_at = models.DateTimeField(auto_created=True)


class Device(models.Model):
	serial = models.CharField(max_length=50, unique=True)
	name = models.CharField(max_length=50)
	unit = models.CharField(max_length=50, verbose_name="Measure unit")
	device_measure_data = models.ManyToManyField(DataMeasure, blank=True)
