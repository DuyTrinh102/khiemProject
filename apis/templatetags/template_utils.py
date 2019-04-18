import datetime
from django import template
from places.models import Place


register = template.Library()


@register.simple_tag
def current_time():
    return Place.objects.all().first()
