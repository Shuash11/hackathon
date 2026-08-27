from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import UserSerializer
from .cookies import JWTCookieService
from .google import GoogleTokenVerificationError, GoogleTokenVerifier
from .serializers import GoogleCredentialSerializer, SupabaseCredentialSerializer
from .services import GoogleAuthenticationService
from .supabase import SupabaseTokenVerificationError, SupabaseTokenVerifier


@method_decorator(csrf_protect, name="dispatch")
class GoogleLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    verifier_class = GoogleTokenVerifier
    service_class = GoogleAuthenticationService
    cookie_service_class = JWTCookieService

    def post(self, request):
        serializer = GoogleCredentialSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            identity = self.verifier_class().verify(serializer.validated_data["credential"])
        except GoogleTokenVerificationError as error:
            return Response({"detail": str(error)}, status=400)
        user = self.service_class().authenticate(identity)
        response = Response({"user": UserSerializer(user).data})
        self.cookie_service_class().set_credentials(response, user)
        return response


@method_decorator(csrf_exempt, name="dispatch")
class SupabaseLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    verifier_class = SupabaseTokenVerifier
    service_class = GoogleAuthenticationService
    cookie_service_class = JWTCookieService

    def post(self, request):
        serializer = SupabaseCredentialSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            identity = self.verifier_class().verify(serializer.validated_data["access_token"])
        except SupabaseTokenVerificationError as error:
            return Response({"detail": str(error)}, status=400)
        user = self.service_class().authenticate(identity)
        response = Response({"user": UserSerializer(user).data})
        self.cookie_service_class().set_credentials(response, user)
        return response


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"user": UserSerializer(request.user).data})


@method_decorator(csrf_protect, name="dispatch")
class RefreshView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    cookie_service_class = JWTCookieService

    def post(self, request):
        raw_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE)
        if not raw_token:
            return Response({"detail": "Refresh token missing."}, status=401)
        try:
            access_token = RefreshToken(raw_token).access_token
        except TokenError:
            return Response({"detail": "Refresh token invalid."}, status=401)
        response = Response(status=204)
        self.cookie_service_class().set_access_token(response, str(access_token))
        return response


@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):
    permission_classes = [AllowAny]
    cookie_service_class = JWTCookieService

    def post(self, request):
        response = Response(status=204)
        self.cookie_service_class().clear_credentials(response)
        return response
