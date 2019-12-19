from django import template
register = template.Library()


@register.filter
def index(obj_list, i):
    return obj_list[int(i)]
