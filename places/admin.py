# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Place, Load, Sensor


class LoadInlines(admin.TabularInline):
	model = Load
	fields = ('name', 'serial', 'typeLoad', 'status')
	extra = 0


class SensorInlines(admin.TabularInline):
	model = Sensor
	fields = ('name', 'serial', 'type_display', 'unit')
	extra = 0


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
	list_display = ('name', 'address', 'owner')
	fields = ('place_code', 'name', 'address', 'owner')
	inlines = [
		LoadInlines,
		SensorInlines
	]
