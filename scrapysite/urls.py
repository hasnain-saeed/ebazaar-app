
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from django.views.generic import TemplateView

from users import views as user_views

urlpatterns = [
    path('api/', include('users.api.urls')),
    path('api/', include('scrapyapp.api.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html'))
]

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('register/', user_views.RegisterView.as_view(), name='register'),
#     path('staff/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
#     path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name='logout'),
#     path('profile/', user_views.ProfileView.as_view(), name='profile'),
#     path('api/', include('users.api.urls')),
#     path('api/', include('scrapyapp.api.urls')),
#     path('', include('scrapyapp.urls')),
# ]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [url(r'^silk/', include('silk.urls', namespace='silk'))]
