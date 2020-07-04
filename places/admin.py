# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django import forms
from .models import Place, Load, Sensor


class LoadForm(forms.ModelForm):
	class Meta:
		model = Load
		fields = '__all__'
		widgets = {
			'password': forms.PasswordInput(render_value=True),
		}


class LoadInlines(admin.TabularInline):
	model = Load
	form = LoadForm
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
