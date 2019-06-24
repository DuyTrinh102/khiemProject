from django.conf.urls import url, include
from django.contrib import admin
from apis import views

urlpatterns = [
	url(r'^admin/', admin.site.urls),
	url(r'^api/', include('apis.urls')),
	url(r'^', views.home_page, name='home_page'),
]

admin.site.site_header = 'IoT Project Administration'
admin.site.index_title = 'IoT Project'
admin.site.site_title = 'Administration Page'
