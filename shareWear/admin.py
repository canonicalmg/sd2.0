from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(clothing)
admin.site.register(outfit)
admin.site.register(profile)
admin.site.register(outfit_item)
admin.site.register(profile_likes_outfit)
admin.site.register(tag)
