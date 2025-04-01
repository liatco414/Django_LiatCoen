from django import template

register = template.Library()

@register.filter
def join_space(value):
    if isinstance(value, (list, tuple)):
        return " ".join(value)
    return value

# usage:
# include templatetags in settings.py
# {% load custom_filters %}
# {% tags|join_space %}