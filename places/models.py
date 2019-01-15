# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

LOAD_LIST = ['load1', 'load2', 'load3', 'load4']


class Place(models.Model):
	place_code = models.CharField(max_length=50, unique=True, null=True)
	name = models.CharField(max_length=50)
	address = models.TextField(blank=True, null=True)
	owner = models.ForeignKey(User, related_name="related_place")
	load_main = models.BooleanField(default=False)

	def __unicode__(self):
		return unicode("{}-{}".format(self.name, self.owner.username))


class Load(models.Model):
	place = models.ForeignKey(Place, related_name="related_loads")
	name = models.CharField(max_length=10)
	status = models.BooleanField(default=False)
