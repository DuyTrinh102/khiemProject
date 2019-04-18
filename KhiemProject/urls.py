from django.conf.urls import url, include
from django.contrib import admin
from apis import views

urlpatterns = [
	url(r'^admin/', admin.site.urls),
	url(r'^home/', views.home_page, name='home_page'),
	url(r'^api/', include('apis.urls'))
]

admin.site.site_header = 'Khiem Project Administration'
admin.site.index_title = 'IoT Project'
admin.site.site_title = 'Nguyen Tien Khiem'
