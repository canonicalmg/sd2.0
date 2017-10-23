from django.contrib import admin
from .models import *

admin.site.register(category)
admin.site.register(article)
admin.site.register(live_document)