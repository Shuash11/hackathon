from django.conf import settings
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """Authenticates access JWTs from HttpOnly cookies and protects unsafe calls."""

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.JWT_ACCESS_COOKIE)
        if not raw_token:
            return None
        validated_token = self.get_validated_token(raw_token)
        self.enforce_csrf(request)
        return self.get_user(validated_token), validated_token

    @staticmethod
    def enforce_csrf(request) -> None:
        check = CSRFCheck(lambda request: None)
        check.process_request(request)
        failure_reason = check.process_view(request, None, (), {})
        if failure_reason:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(f"CSRF validation failed: {failure_reason}")
