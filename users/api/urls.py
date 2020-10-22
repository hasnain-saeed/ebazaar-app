from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

from users.api import views

urlpatterns = [
    path('login/', obtain_auth_token, name='login-user'),
    path('register/', views.RegisterView.as_view({'post': 'post'}), name='register-user')
]
