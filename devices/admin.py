# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Device, DataMeasure


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
	list_display = ('serial', 'unit')
	filter_horizontal = ('device_measure_data',)


@admin.register(DataMeasure)
class MeasureAdmin(admin.ModelAdmin):
	list_display = ('value', 'receive_at')


