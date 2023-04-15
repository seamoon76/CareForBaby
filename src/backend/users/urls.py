from django.urls import path
from .views import (RegisterView, LoginView, SetNewPasswordAPIView, UserView, PasswordTokenCheckAPI, 
                    RequestPasswordResetEmail, UserListAPIView, UserDetailAPIView, wxLoginView,GetOpenidView)
from knox import views as knox_views


urlpatterns = [
    path('api/register', RegisterView.as_view(), name="register"),
    path('api/login', LoginView.as_view(), name="login"),
    path('api/wxlogin', wxLoginView.as_view(), name="wxlogin"),
    path('api/self', UserView.as_view(), name="self"),
    path('api/logout', knox_views.LogoutView.as_view(), name="logout"),
    path('api/request-reset-email', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('api/password-reset/<uidb64>/<token>/',
         PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('api/password-reset-complete', SetNewPasswordAPIView.as_view(),
         name='password-reset-complete'),
    path('api/users', UserListAPIView.as_view(),
         name='users'),
    path('api/users/<int:pk>', UserDetailAPIView.as_view(),
         name='user'),
     path('api/getopenid',GetOpenidView.as_view())
]

