# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Place(models.Model):
	place_code = models.CharField(max_length=50, unique=True, null=True)
	name = models.CharField(max_length=50)
	address = models.TextField(blank=True, null=True)
	owner = models.ForeignKey(User, related_name="related_place")

	def __unicode__(self):
		return unicode("{}-{}".format(self.name, self.owner.username))

