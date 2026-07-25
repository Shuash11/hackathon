from dataclasses import dataclass

from django.conf import settings
from google.auth.transport.requests import Request
from google.oauth2 import id_token


class GoogleTokenVerificationError(ValueError):
    pass


@dataclass(frozen=True)
class GoogleIdentity:
    subject: str
    email: str
    email_verified: bool
    given_name: str = ""
    family_name: str = ""


class GoogleTokenVerifier:
    """Boundary around Google's token verifier, making the provider easy to mock."""

    def verify(self, credential: str) -> GoogleIdentity:
        if not settings.GOOGLE_CLIENT_ID:
            raise GoogleTokenVerificationError("Google sign-in is not configured")
        try:
            claims = id_token.verify_oauth2_token(
                credential, Request(), settings.GOOGLE_CLIENT_ID
            )
        except Exception as error:
            raise GoogleTokenVerificationError("Invalid Google credential") from error
        if not claims.get("sub") or not claims.get("email") or not claims.get("email_verified"):
            raise GoogleTokenVerificationError("Google account must have a verified email")
        return GoogleIdentity(
            subject=claims["sub"],
            email=claims["email"],
            email_verified=claims["email_verified"],
            given_name=claims.get("given_name", ""),
            family_name=claims.get("family_name", ""),
        )
