from django.conf.urls import url
import views

urlpatterns = [
	url(r'^log-in/', views.login_account, name='login_account'),
	url(r'^log-out/', views.logout_account, name='logout_account'),
	url(r'^change-password/', views.change_password, name='change_password'),
	url(r'^sign-up/', views.signup, name='signup-account'),
	url(r'^authentication/', views.api_authentication, name='authentication'),
	url(r'^/change/authentication/', views.api_change_authentication, name='api_change_authentication'),
	url(r'^load/validate/', views.api_auth_validate, name='api_auth_validate'),
	url(r'^application-main/', views.application_main, name='application_main'),
	url(r'^places/devices/get/', views.view_get_devices_places, name='view_get_devices_places'),
	url(r'^places/create/', views.api_create_place, name='api_create_place'),
	url(r'^places/control/', views.api_control_place, name='api_control_place'),
	url(r'^places/config/price/', views.api_config_price, name='api_config_price'),
	url(r'^device/create/', views.api_create_device, name='api_create_device'),
	url(r'^device/delete/', views.api_delete_device, name='api_delete_device'),
	url(r'^device/show/chart/', views.view_show_chart, name='view_show_chart'),
	url(r'^device/show/payment/', views.view_show_payment, name='view_show_payment'),
	url(r'^device/measure/update/', views.api_device_measure_update, name='api_device_measure_update'),
	url(r'^device/load/update/', views.api_update_load, name='api_update_load'),
]
