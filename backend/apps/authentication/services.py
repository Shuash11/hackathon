from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.users.models import User
from .google import GoogleIdentity


class GoogleAuthenticationService:
    """Links a verified Google identity to exactly one local user."""

    @transaction.atomic
    def authenticate(self, identity: GoogleIdentity) -> User:
        user = User.objects.filter(google_subject=identity.subject).first()
        if user:
            if user.email != identity.email:
                email_owner = User.objects.filter(email__iexact=identity.email).exclude(pk=user.pk).first()
                if email_owner:
                    raise ValidationError({"credential": "This email belongs to another account."})
                user.email = identity.email
            self._update_profile(user, identity)
            user.save()
            return user

        user = User.objects.filter(email__iexact=identity.email).first()
        if user and user.google_subject:
            raise ValidationError({"credential": "This email is linked to another Google account."})
        if user is None:
            user = User.objects.create_user(email=identity.email, google_subject=identity.subject)
        else:
            user.google_subject = identity.subject
        self._update_profile(user, identity)
        user.save()
        return user

    @staticmethod
    def _update_profile(user: User, identity: GoogleIdentity) -> None:
        user.first_name = identity.given_name or user.first_name
        user.last_name = identity.family_name or user.last_name
