# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from places.models import Place

UNIT_DEVICE = (
	('m3', 'm3'),
	('tds', 'tds')
)


class DataMeasure(models.Model):
	value = models.IntegerField()
	receive_at = models.DateTimeField(auto_now_add=True)


class Device(models.Model):
	place = models.ForeignKey(Place, related_name="devices")
	serial = models.CharField(max_length=50, unique=True)
	name = models.CharField(max_length=50)
	unit = models.CharField(max_length=50, verbose_name="Measure unit", choices=UNIT_DEVICE)
	device_measure_data = models.ManyToManyField(DataMeasure, blank=True)

	def __unicode__(self):
		return unicode(self.name)
