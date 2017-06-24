# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.views import defaults as default_views
from django.views.generic import TemplateView
from rest_framework_swagger.views import get_swagger_view

import config.apirouter as apirouter

# required for Django view
from django.contrib.auth.views import login


schema_view = get_swagger_view(title="test API")

urlpatterns = [
    # Django Admin, use {% url 'admin:index' %}
    url(settings.ADMIN_URL, admin.site.urls),

    # Common URLS
    url(r'^common/', include('test.common.urls', namespace='common')),
    url(r'^orders/', include('test.orders.urls', namespace='orders')),
    url(r'^users/', include('test.users.urls', namespace='users')),
    url(r'^accounts/', include('test.users.allauth_urls')),

    # swagger
    url(r'^schema/', schema_view),

    # for now, no search engines ...
    url(r'^robots\.txt$', lambda r: HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain"))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# all other routes show angular app - To show the Django frontend, comment this out and uncomment urls above this
urlpatterns += [url(r'^.*$', TemplateView.as_view(template_name='app.html'), name='home')]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        url(r'^400/$', default_views.bad_request, kwargs={'exception': Exception('Bad Request!')}),
        url(r'^403/$', default_views.permission_denied, kwargs={'exception': Exception('Permission Denied')}),
        url(r'^404/$', default_views.page_not_found, kwargs={'exception': Exception('Page not Found')}),
        url(r'^500/$', default_views.server_error),
    ]
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns += [
            url(r'^__debug__/', include(debug_toolbar.urls)),
        ]
