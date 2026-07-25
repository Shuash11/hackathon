from django.urls import path

from .views import CurrentUserView, GoogleLoginView, LogoutView, RefreshView

urlpatterns = [
    path("google/", GoogleLoginView.as_view(), name="google-login"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
