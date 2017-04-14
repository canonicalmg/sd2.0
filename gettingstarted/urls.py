from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import shareWear.views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^', include('shareWear.urls')),
    url(r'^admin/', admin.site.urls),
    url('', include('social_django.urls', namespace='social'))
]


# urlpatterns = [
#     url(r'^$', rentaPuppy.views.index, name='index'),
#     url(r'^db', rentaPuppy.views.db, name='db'),
#     url(r'^admin/', include(admin.site.urls)),
# ]
