# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

LOAD_LIST = ['load1', 'load2', 'load3', 'load4']

STATUS_CONTROL = (
	(True, 'Auto'),
	(False, 'Manual'),
)

TYPE_DISPLAY = (
	(0, 'Warning'),
	(1, 'Display')
)

TYPE_LOAD = (
	(0, 'Normal'),
	(1, 'Secure'),
	(2, 'Levels'),
)


class UnitPrice(models.Model):
	user = models.ForeignKey(User, related_name="unit_price")
	value = models.FloatField(default=0)


class Place(models.Model):
	place_code = models.CharField(max_length=50, unique=True, null=True)
	name = models.CharField(max_length=50)
	address = models.TextField(blank=True, null=True)
	owner = models.ForeignKey(User, related_name="related_place", blank=True, null=True)
	load_main = models.BooleanField(default=False)
	status = models.BooleanField(default=False, choices=STATUS_CONTROL)

	def __unicode__(self):
		return unicode("{}".format(self.name))


class Load(models.Model):
	place = models.ForeignKey(Place, related_name="related_loads")
	name = models.CharField(max_length=30)
	serial = models.CharField(max_length=30, unique=True)
	status = models.BooleanField(default=False)
	typeLoad = models.PositiveIntegerField(default=0, choices=TYPE_LOAD)


class Sensor(models.Model):
	place = models.ForeignKey(Place, related_name="sensors")
	serial = models.CharField(max_length=50, unique=True)
	name = models.CharField(max_length=50)
	unit = models.CharField(max_length=30, blank=True)
	type_display = models.PositiveIntegerField(default=0, choices=TYPE_DISPLAY)

	def __unicode__(self):
		return unicode(self.name)

