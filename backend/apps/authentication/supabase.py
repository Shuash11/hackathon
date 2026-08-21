from dataclasses import dataclass

import requests
from django.conf import settings


class SupabaseTokenVerificationError(ValueError):
    pass


@dataclass(frozen=True)
class SupabaseIdentity:
    subject: str
    email: str
    email_verified: bool
    given_name: str = ""
    family_name: str = ""


class SupabaseTokenVerifier:
    def verify(self, access_token: str) -> SupabaseIdentity:
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            raise SupabaseTokenVerificationError("Supabase auth is not configured")
        try:
            resp = requests.get(
                f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user",
                headers={
                    "apikey": settings.SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {access_token}",
                },
                timeout=8,
            )
        except Exception as error:
            raise SupabaseTokenVerificationError("Could not verify Supabase token") from error
        if resp.status_code != 200:
            raise SupabaseTokenVerificationError("Invalid Supabase token")
        data = resp.json()
        email = data.get("email", "")
        subject = data.get("id", "")
        if not subject or not email:
            raise SupabaseTokenVerificationError("Supabase account must have an email")
        email_verified = bool(data.get("email_confirmed_at") or data.get("confirmed_at"))
        meta = data.get("user_metadata") or {}
        return SupabaseIdentity(
            subject=subject,
            email=email,
            email_verified=email_verified,
            given_name=meta.get("given_name") or meta.get("full_name", "").split(" ")[0] if meta.get("full_name") else meta.get("given_name", ""),
            family_name=meta.get("family_name") or " ".join(meta.get("full_name", "").split(" ")[1:]) if meta.get("full_name") else meta.get("family_name", ""),
        )
