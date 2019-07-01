# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import ast
import datetime

from django.db import IntegrityError
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from accounts.form import SignUpForm, SignInForm, ChangePasswordForm
from django.views.decorators.csrf import csrf_exempt

import json

from apis.commons import publish_topic_mqtt
from apis.fusioncharts import FusionCharts
from devices.models import Device, DataMeasure
from places.models import Place, LOAD_LIST, Load, UnitPrice


def home_page(request):
    if request.user.is_authenticated:
        return redirect('view_get_devices_places')
    return render(request, 'home.html')


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('view_get_devices_places')
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
                return redirect('view_get_devices_places')
    else:
        form = SignInForm()
    return render(request, 'login.html', {'form': form})


def logout_account(request):
    if request.user.is_authenticated:
        logout(request)
        return redirect('home_page')
    return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})


def change_password(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            form = ChangePasswordForm(request.user, request.POST)
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
    return render(request, 'home.html')


def view_get_devices_places(request):
    if request.user.is_authenticated:
        data = []
        places = request.user.related_place.all()
        for place in places:
            data.append({
                'id': place.id,
                'place_code': place.place_code,
                'status': place.status,
                'name': place.name,
                'address': place.address,
                'load_main': place.load_main,
                'loads': place.related_loads.all(),
                'devices': place.devices.all(),
                'sensors': place.sensors.all()
            })
        return render(request, 'device_view.html', {'places': data})
    return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})


@csrf_exempt
def api_create_place(request):
    if request.user.is_authenticated:
        if request.is_ajax():
            place_code = request.POST.get('place_code')
            name = request.POST.get('name')
            address = request.POST.get('address')
            try:
                # Place.objects.create(name=name, address=address, owner=request.user, place_code=place_code)
                place = Place.objects.get(place_code=place_code, owner=None)
                place.name = name
                place.address = address
                place.owner = request.user
                place.save()
                return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!'}), content_type='application/json')
            except Place.DoesNotExist:
                return HttpResponse(json.dumps({'result': False, 'message': 'Mã trạm không tồn tại trong hệ thống!'}), content_type='application/json')
    return HttpResponse(json.dumps({'result': False, 'message': 'Bạn không có quyền thêm nhóm!'}), content_type='application/json')


@csrf_exempt
def api_create_device(request):
    message_error = ""
    if not request.user.is_authenticated:
        message_error = 'Bạn không có quyền thêm thiết bị!'
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
                    Device.objects.create(serial=serial, name=name, unit=unit, place=place)
                    return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!'}), content_type='application/json')
                except IntegrityError:
                    message_error = "Mã serial đã được sử dụng!"
    return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')


# @api_view(['POST'])
# @permission_classes((permissions.BasePermission,))
# def api_auth_validate(request):
#     place_id = request.POST.get('place_id')
#     try:
#         place = Place.objects.get(place_code=place_id)
#         if not place.owner:
#             raise Exception('Modem này chưa được thêm vào hệ thống!')
#     except Place.DoesNotExist:
#         message_error = "Không tìm thấy khu vực này!"
#     except Exception as e:
#         message_error = e
#     else:
#         return HttpResponse(json.dumps(
#             {'result': True, 'message': place.owner.username}), content_type='application/json')
#     return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')


@api_view(['POST'])
@permission_classes((permissions.BasePermission,))
def api_auth_validate(request):
    username = request.POST.get('serial')
    password = request.POST.get('password')
    user = Load.objects.filter(serial=username, password=password, typeLoad=1).first()
    if user:
        return HttpResponse(json.dumps(
                {'result': True, 'message': 'Xác thực thành công'}), content_type='application/json')
    else:
        message_error = 'Mật khẩu không đúng!'
    return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')


@csrf_exempt
def api_authentication(request):
    message_error = ""
    if not request.user.is_authenticated:
        message_error = 'Bạn không có quyền điều khiển thiết bị!'
    else:
        if request.is_ajax():
            password = request.POST.get('password')
            place_id, load_name, control_type = request.POST.get('place_id').split('-')
            place_code = request.POST.get('place_code')
            try:
                place = request.user.related_place.get(place_code=place_id)
            except Place.DoesNotExist:
                message_error = "Không tìm thấy khu vực này!"
            else:
                load = place.related_loads.filter(serial=load_name, password=password).first()
                if not load:
                    message_error = "Mật khẩu không đúng! Vui lòng thử lại!"
                else:
                    is_checked_data = 'a' if not load.status else 'b'
                    if load:
                        load.status = not load.status
                        load.save()
                    if publish_topic_mqtt('{place_code}-{load_id}:{is_checked}-controlB'.format(place_code=place_code, load_id=load.serial, is_checked=is_checked_data)):
                        return HttpResponse(json.dumps({'result': True, 'isPub': False, 'message': 'Thành công!', 'status': False}), content_type='application/json')
                    return HttpResponse(json.dumps(
                        {'result': True, 'isPub': True, 'message': '{place_code}-{load_id}:{is_checked}-controlB'.format(place_code=place_code, load_id=load.serial, is_checked=is_checked_data),
                         'status': False}), content_type='application/json')
    return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')


@csrf_exempt
def api_change_authentication(request):
    message_error = ""
    if not request.user.is_authenticated:
        message_error = 'Bạn không có quyền điều khiển thiết bị!'
    else:
        if request.is_ajax():
            old_password = request.POST.get('old_password')
            new_password = request.POST.get('new_password')
            load_name, key = request.POST.get('load_info').split('-')
            load = Load.objects.filter(serial=load_name, password=old_password).first()
            if not load:
                message_error = "Mật khẩu cũ không đúng! Vui lòng thử lại!"
            else:
                load.password = new_password
                load.save()
                return HttpResponse(json.dumps(
                    {'result': True, 'message': 'Cập nhật mật khẩu mới thành công!'}), content_type='application/json')
    return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')


@csrf_exempt
def api_control_place(request):
    message_error = ""
    if not request.user.is_authenticated:
        message_error = 'Bạn không có quyền thêm thiết bị!'
    else:
        if request.is_ajax():
            print request.POST.get('place_id').split('-')
            place_id, load_name, control_type = request.POST.get('place_id').split('-')
            place_code = request.POST.get('place_code')
            is_checked = request.POST.get('is_checked')
            is_checked_data = 'a' if is_checked == 'true' else 'b'
            is_checked_bool = True if is_checked == 'true' else False

            try:
                place = request.user.related_place.get(place_code=place_code)
            except Place.DoesNotExist:
                message_error = "Không tìm thấy nhóm này!"
                return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')
            else:
                if load_name == 'load_main':
                    place.load_main = is_checked_bool
                    place.save()
                    if publish_topic_mqtt('{place_code}-{load_id}-{is_checked}'.format(place_code=place_code, load_id=load_name, is_checked=is_checked_data)):
                        return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!', 'status': False}), content_type='application/json')
                elif load_name == 'status':
                    place.status = is_checked_bool
                    place.save()
                    if publish_topic_mqtt('{place_code}-{load_id}-{is_checked}'.format(place_code=place_code, load_id=load_name, is_checked=is_checked_data)):
                        if is_checked_bool:
                            return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!', 'status': True, 'is_checked': True}), content_type='application/json')
                        return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!', 'status': True, 'is_checked': False}), content_type='application/json')
                else:
                    load = place.related_loads.filter(serial=load_name).first()
                    if load.typeLoad != 2:
                        is_checked_data = 'a' if not load.status else 'b'
                        if load:
                            load.status = not load.status
                            load.save()
                    else:
                        is_checked_data = is_checked
                    if publish_topic_mqtt('{place_code}-{load_id}:{is_checked}-{control_type}'.format(place_code=place_code, load_id=load.serial, is_checked=is_checked_data, control_type=control_type)):
                        return HttpResponse(json.dumps({'result': True, 'isPub': False, 'message': 'Thành công!', 'status': False}), content_type='application/json')
                    return HttpResponse(json.dumps({'result': True, 'isPub': True, 'message': '{place_code}-{load_id}:{is_checked}-{control_type}'.format(place_code=place_code, load_id=load.serial, is_checked=is_checked_data, control_type=control_type), 'status': False}), content_type='application/json')
                message_error = 'Không thể gửi tín hiệu, kiểm tra lại kết nối của bạn!'
    return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')


@api_view(['POST'])
@permission_classes((permissions.BasePermission,))
def api_update_load(request):
    try:
        place_id, load_control, stt = request.POST.get('data').split('-')
        try:
            place = Place.objects.get(place_code=place_id)
        except Place.DoesNotExist:
            message_error = "Không tìm thấy nhóm này!"
            return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')
        else:
            load_name, load_data = load_control.split(':')
            load = place.related_loads.filter(serial=load_name).first()
            is_checked_data = True if load_data == 'a' else False
            if load:
                load.status = is_checked_data
                load.save()
            return HttpResponse(json.dumps({'result': True, 'message': 'Success'}), content_type='application/json')
    except Exception as e:
        message_error = str(e)
    return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')


@csrf_exempt
def api_delete_device(request):
    message_error = ""
    if not request.user.is_authenticated:
        message_error = 'Bạn không có quyền thêm thiết bị!'
    else:
        if request.is_ajax():
            device_id = request.POST.get('device_id')
            try:
                device = Device.objects.get(id=device_id)
            except Device.DoesNotExist:
                message_error = "Không tìm thấy nhóm này!"
                return HttpResponse(json.dumps({'result': False, 'message': message_error}), content_type='application/json')
            else:
                device.delete()
                return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!'}), content_type='application/json')
    return HttpResponse(json.dumps({'result': True, 'message': message_error}), content_type='application/json')


@csrf_exempt
def api_config_price(request):
    message_error = ""
    if not request.user.is_authenticated:
        message_error = 'Bạn không có quyền!'
    else:
        if request.is_ajax():
            value = request.POST.get('value')
            if not value.isdigit():
                message_error = 'Bạn phải nhập kiểu số'
            else:
                unit_price, created = UnitPrice.objects.get_or_create(user=request.user)
                unit_price.value = value
                unit_price.save()
                return HttpResponse(json.dumps({'result': True, 'message': 'Thành công!'}), content_type='application/json')
    return HttpResponse(json.dumps({'result': True, 'message': message_error}), content_type='application/json')


def view_show_chart(request):
    if request.user.is_authenticated:
        data_list = []
        from_date = None
        to_date = None
        is_filter = False
        if 'GET' in request.method:
            from_date = request.GET.get('from_date')
            to_date = request.GET.get('to_date')
            if from_date and to_date:
                from_date = datetime.datetime.strptime(from_date + ' 00:00:00', '%Y-%m-%d %H:%M:%S')
                to_date = datetime.datetime.strptime(to_date + ' 23:59:59', '%Y-%m-%d %H:%M:%S')
                if from_date < to_date:
                    is_filter = True
        for place in request.user.related_place.all():
            temp = {}
            temp.update({
                "place_name": place.name,
                "devices": []
            })
            for device in place.devices.all():
                data_source = {}
                data_source['chart'] = {
                    "subCaption": "Measurement",
                    "xAxisName": "Time",
                    "yAxisName": "Value ({})".format(device.unit),
                    "caption": "DEVICES",
                    # "anchorbgcolor": "BBDA00",
                    # "anchorbordercolor": "FFFFFF",
                    # "anchorborderthickness": "2",
                    # "anchorradius": "4",
                    "basefontcolor": "FFFFFF",
                    "bgalpha": "100",
                    "bgcolor": "6DA5DB",
                    "canvasbgalpha": "0",
                    # "canvasbordercolor": "FFFFFF",
                    # "canvaspadding": "10",

                    # "divlinealpha": "100",
                    # "divlinecolor": "FFFFFF",
                    # "labeldisplay": "ROTATE",
                    "slantlabels": "1",
                    "anchorradius": "0",
                    "anchorgbalpha": "10",
                    "linecolor": "BBDA00",
                    "numbersuffix": "",
                    # "numvdivlines": "10",
                    # "showalternatevgridcolor": "0",
                    # "showborder": "0",
                    "showvalues": "0",
                    "tooltipbgcolor": "406181",
                    "tooltipbordercolor": "406181",
                    "vdivlineisdashed": "1",
                    "vdivlinecolor": "#ffffff",
                    "vdivlinealpha": "100",
                    # "yaxismaxvalue": "100",
                    "animation": "1",
                }

                data_source['data'] = []

                for key in device.device_measure_data.all():
                    data = {}
                    data['label'] = key.receive_at.strftime("%Y/%m/%d %H:%M")
                    data['value'] = key.value
                    if is_filter:
                        if from_date < key.receive_at.replace(tzinfo=None) < to_date:
                            data_source['data'].append(data)
                    else:
                        data_source['data'].append(data)
                column2D = FusionCharts("line", "{}".format(device.serial), "700", "450", "{}".format(device.id), "json", data_source)
                # data_list.append(column2D)
                temp['devices'].append({
                    "serial": device.serial,
                    "name": device.name,
                    "chart": column2D
                })
            data_list.append(temp)
        return render(request, 'device_graph.html', {'data_list': data_list})
    return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})


@api_view(['POST'])
@permission_classes((permissions.BasePermission,))
def api_device_measure_update(request):
    error = []
    data = request.data.get('data', '')
    if not data:
        error.append({
            "field": "data",
            "message": "Data is required"
        })
    elif isinstance(data, unicode):
        try:
            data = ast.literal_eval(data)
        except ValueError:
            error.append({
                "field": "data",
                "message": "Data is invalid"
            })
    if not error:
        if isinstance(data, list):
            for data_temp in data:
                if not isinstance(data_temp, dict) or ['serial', 'value'] != data_temp.keys():
                    break
                else:
                    try:
                        device = Device.objects.get(serial=data_temp['serial'])
                    except Device.DoesNotExist:
                        error.append({
                            "field": "serial",
                            "message": "Invalid"
                        })
                    else:
                        measure = DataMeasure.objects.create(value=data_temp['value'])
                        device.device_measure_data.add(measure)
            return Response({"result": True, "message": "Successful", "data": []}, status=status.HTTP_200_OK)
        error.append({
            "field": "data",
            "message": "Data is invalid"
        })
    return Response({"result": False, "message": "Error!!!", "data": error}, status=status.HTTP_200_OK)


def view_show_payment(request):
    if request.user.is_authenticated:
        data_list = []
        total_water = 0
        month = None
        if 'GET' in request.method:
            month_data = request.GET.get('month')
            if month_data:
                date = datetime.datetime.strptime(month_data, '%Y-%m')
                if date <= datetime.datetime.now():
                    month = date.month
        if not month:
            month = datetime.datetime.now().month

        for place in request.user.related_place.all():
            temp = {}
            temp.update({
                "place": place,
                'month': month
            })
            devices = place.devices.filter(unit='m3')
            for device in devices:
                for data in device.device_measure_data.all():
                    total_water += data.value
            unit_price = request.user.unit_price.all().first()
            unit_price = unit_price.value if unit_price is not None else 0
            temp.update({
                'unit_price': unit_price,
                'water_quality': total_water,
                'total_price': '{:,}'.format(int((total_water / 1000) * int(unit_price)))
            })
            data_list.append(temp)
            total_water = 0
        return render(request, 'payment_water.html', {'places': data_list})
    return render(request, 'includes/403.html', {'message': 'Vui lòng đăng nhập lại !'})
