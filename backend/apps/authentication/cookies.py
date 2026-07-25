from django.conf import settings
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken


class JWTCookieService:
    def set_credentials(self, response: HttpResponse, user) -> None:
        refresh = RefreshToken.for_user(user)
        self._set(response, settings.JWT_ACCESS_COOKIE, str(refresh.access_token), settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
        self._set(response, settings.JWT_REFRESH_COOKIE, str(refresh), settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

    def set_access_token(self, response: HttpResponse, access_token: str) -> None:
        self._set(response, settings.JWT_ACCESS_COOKIE, access_token, settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())

    def clear_credentials(self, response: HttpResponse) -> None:
        for name in (settings.JWT_ACCESS_COOKIE, settings.JWT_REFRESH_COOKIE):
            response.delete_cookie(name, path="/", samesite=settings.JWT_COOKIE_SAMESITE)

    @staticmethod
    def _set(response: HttpResponse, name: str, value: str, max_age: float) -> None:
        response.set_cookie(
            name,
            value,
            max_age=int(max_age),
            httponly=True,
            secure=settings.JWT_COOKIE_SECURE,
            samesite=settings.JWT_COOKIE_SAMESITE,
            path="/",
        )
