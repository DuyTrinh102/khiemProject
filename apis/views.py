# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import IntegrityError
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from accounts.form import SignUpForm, SignInForm, ChangePasswordForm
from django.views.decorators.csrf import csrf_exempt

import json

from apis.fusioncharts import FusionCharts
from devices.models import Device, DataMeasure
from places.models import Place


def home_page(request):
	return render(request, 'home.html')


def signup(request):
	if request.method == 'POST':
		form = SignUpForm(request.POST)
		print form.is_valid()
		print form
		if form.is_valid():
			form.save()
			username = form.cleaned_data.get('username')
			raw_password = form.cleaned_data.get('password1')
			user = authenticate(username=username, password=raw_password)
			login(request, user)
			return redirect('application_main')
	else:
		form = SignUpForm()
	return render(request, 'signup.html', {'form': form})


def login_account(request):
	if request.method == 'POST':
		form = SignInForm(data=request.POST)
		if form.is_valid():
			user = form.get_user()
			if user is not None:
				login(request, user)
				return redirect('application_main')
	else:
		form = SignInForm()
	return render(request, 'login.html', {'form': form})


def logout_account(request):
	print request.META
	if request.user.is_authenticated:
		logout(request)
		return redirect('home_page')
	return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})


def change_password(request):
	if request.user.is_authenticated:
		if request.method == 'POST':
			form = ChangePasswordForm(request.user, request.POST)
			print form.is_valid(), request.POST
			if form.is_valid():
				form.save()
				logout(request)
				return redirect('home_page')
		else:
			form = ChangePasswordForm(request.user)
		return render(request, 'change_password.html', {'form': form})
	return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})


def application_main(request):
	if request.user.is_authenticated:
		return render(request, 'application_main.html', {'user': request.user})
	return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})


def view_get_devices_places(request):
	if request.user.is_authenticated:
		places = request.user.related_place.all()
		return render(request, 'device_view.html', {'places': places})
	return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})


@csrf_exempt
def api_create_place(request):
	if request.user.is_authenticated:
		if request.is_ajax():
			name = request.POST.get('name')
			address = request.POST.get('address')
			Place.objects.create(name=name, address=address, owner=request.user)
			return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!'}), content_type='application/json')
	return HttpResponse(json.dumps({'result': True, 'message': 'Bạn không có quyền thêm nhóm!'}), content_type='application/json')


@csrf_exempt
def api_create_device(request):
	message_error = ""
	if not request.user.is_authenticated:
		message_error = 'Bạn không có quyền thêm nhóm!'
	else:
		if request.is_ajax():
			serial = request.POST.get('serial')
			name = request.POST.get('name')
			unit = request.POST.get('unit')
			place_id = request.POST.get('place_id')
			try:
				place = request.user.related_place.get(id=place_id)
			except Place.DoesNotExist:
				pass
			else:
				try:
					device = Device.objects.create(serial=serial, name=name, unit=unit)
					place.devices.add(device)
					return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!'}), content_type='application/json')
				except IntegrityError:
					message_error = "Mã serial đã được sử dụng!"
	print message_error
	return HttpResponse(json.dumps({'result': True, 'message': message_error}), content_type='application/json')


def view_show_chart(request):
	if request.user.is_authenticated:

		# Iterate through the data in `Revenue` model and insert in to the `data_source['data']` list.
		print request.user.related_place.all()
		data_list = []
		temp = {}
		for place in request.user.related_place.all():
			temp.update({
				"place_name": place.name,
				"devices": []
			})
			for device in place.devices.all():
				data_source = {}
				data_source['chart'] = {
					"subCaption": "Measurement",
					"xAxisName": "Time",
					"yAxisName": "Value (In unit)",
					"caption": "Monthly revenue for last year",
					"numberPrefix": "$",
					"theme": "zune"
				}

				data_source['data'] = []
				temp['devices'].append({
					"serial": device.serial,
					"data": device.device_measure_data.all()
				})
				print device.device_measure_data.all()
				for key in device.device_measure_data.all():
					data = {}
					data['label'] = key.receive_at.strftime("%Y/%m/%d %H:%M")
					data['value'] = key.value
					data_source['data'].append(data)
				if len(data_source['data']):
					column2D = FusionCharts("line", "{}".format(device.serial), "600", "350", "{}".format(device.name), "json", data_source)
					data_list.append(column2D)
					print data_source['data']
		print data_list

		# Create an object for the Column 2D chart using the FusionCharts class constructor

		return render(request, 'device_graph.html', {'data_list': data_list})
	return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})
