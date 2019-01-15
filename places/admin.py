# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Place, Load


class LoadInlines(admin.TabularInline):
	model = Load
	fields = ('name', 'status')


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
	list_display = ('name', 'address', 'owner')
	inlines = [
		LoadInlines
	]
