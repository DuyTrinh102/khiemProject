from django.conf.urls import url
import views

urlpatterns = [
	url(r'^log-in/', views.login_account, name='login_account'),
	url(r'^log-out/', views.logout_account, name='logout_account'),
	url(r'^change-password/', views.change_password, name='change_password'),
	url(r'^sign-up/', views.signup, name='signup-account'),
	url(r'^application-main/', views.application_main, name='application_main'),
	url(r'^places/devices/get/', views.view_get_devices_places, name='view_get_devices_places'),
	url(r'^places/create/', views.api_create_place, name='api_create_place'),
	url(r'^device/create/', views.api_create_device, name='api_create_device'),
	url(r'^device/show/chart/', views.view_show_chart, name='view_show_chart'),
]
