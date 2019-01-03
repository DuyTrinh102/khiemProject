# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Place


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
	list_display = ('name', 'address', 'owner')
