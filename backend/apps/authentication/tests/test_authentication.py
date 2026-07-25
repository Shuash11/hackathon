import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authentication.google import GoogleIdentity
from apps.users.models import User


@pytest.mark.django_db
def test_google_login_creates_user_and_sets_http_only_cookies(api_client, monkeypatch):
    identity = GoogleIdentity("google-1", "person@example.com", True, "Person", "Example")
    monkeypatch.setattr("apps.authentication.views.GoogleTokenVerifier.verify", lambda *_: identity)

    response = api_client.post(reverse("google-login"), {"credential": "valid"}, format="json")

    assert response.status_code == 200
    assert response.data["user"]["email"] == "person@example.com"
    assert response.cookies["access_token"]["httponly"]
    assert User.objects.get().google_subject == "google-1"


@pytest.mark.django_db
def test_google_login_links_existing_email_user(api_client, monkeypatch):
    user = User.objects.create_user("person@example.com")
    identity = GoogleIdentity("google-1", "person@example.com", True)
    monkeypatch.setattr("apps.authentication.views.GoogleTokenVerifier.verify", lambda *_: identity)

    response = api_client.post(reverse("google-login"), {"credential": "valid"}, format="json")

    assert response.status_code == 200
    user.refresh_from_db()
    assert user.google_subject == "google-1"


@pytest.mark.django_db
def test_google_login_rejects_invalid_credential(api_client, monkeypatch):
    from apps.authentication.google import GoogleTokenVerificationError

    def reject(*_):
        raise GoogleTokenVerificationError("Invalid Google credential")

    monkeypatch.setattr("apps.authentication.views.GoogleTokenVerifier.verify", reject)
    response = api_client.post(reverse("google-login"), {"credential": "bad"}, format="json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_google_login_requires_csrf_and_accepts_a_matching_token(monkeypatch):
    client = APIClient(enforce_csrf_checks=True)
    identity = GoogleIdentity("google-1", "person@example.com", True)
    monkeypatch.setattr("apps.authentication.views.GoogleTokenVerifier.verify", lambda *_: identity)

    blocked = client.post(reverse("google-login"), {"credential": "valid"}, format="json")
    client.get(reverse("health"))
    accepted = client.post(
        reverse("google-login"),
        {"credential": "valid"},
        format="json",
        HTTP_X_CSRFTOKEN=client.cookies["csrftoken"].value,
    )

    assert blocked.status_code == 403
    assert accepted.status_code == 200


@pytest.mark.django_db
def test_google_login_rejects_email_linked_to_other_google_account(api_client, monkeypatch):
    User.objects.create_user("person@example.com", google_subject="original-subject")
    identity = GoogleIdentity("different-subject", "person@example.com", True)
    monkeypatch.setattr("apps.authentication.views.GoogleTokenVerifier.verify", lambda *_: identity)

    response = api_client.post(reverse("google-login"), {"credential": "valid"}, format="json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_current_user_requires_cookie_and_returns_user(api_client):
    user = User.objects.create_user("person@example.com")
    refresh = RefreshToken.for_user(user)
    api_client.cookies["access_token"] = str(refresh.access_token)

    response = api_client.get(reverse("current-user"))
    assert response.status_code == 200
    assert response.data["user"]["email"] == user.email


@pytest.mark.django_db
def test_current_user_rejects_anonymous_requests(api_client):
    response = api_client.get(reverse("current-user"))
    assert response.status_code == 401


@pytest.mark.django_db
def test_refresh_and_logout_cookie_behavior(api_client):
    user = User.objects.create_user("person@example.com")
    refresh = RefreshToken.for_user(user)
    api_client.cookies["refresh_token"] = str(refresh)
    api_client.cookies["csrftoken"] = "test-csrf-token"

    refresh_response = api_client.post(reverse("refresh"), HTTP_X_CSRFTOKEN="test-csrf-token")
    assert refresh_response.status_code == 204
    assert "access_token" in refresh_response.cookies


@pytest.mark.django_db
def test_logout_clears_authentication_cookies(api_client):
    user = User.objects.create_user("person@example.com")
    refresh = RefreshToken.for_user(user)
    api_client.cookies["access_token"] = str(refresh.access_token)

    response = api_client.post(reverse("logout"))

    assert response.status_code == 204
    assert response.cookies["access_token"].value == ""
    assert response.cookies["refresh_token"].value == ""


@pytest.mark.django_db
def test_cookie_authenticated_unsafe_request_requires_csrf_token():
    client = APIClient(enforce_csrf_checks=True)
    client.get(reverse("health"))
    user = User.objects.create_user("person@example.com")
    refresh = RefreshToken.for_user(user)
    client.cookies["access_token"] = str(refresh.access_token)

    blocked = client.post(reverse("logout"))
    accepted = client.post(
        reverse("logout"), HTTP_X_CSRFTOKEN=client.cookies["csrftoken"].value
    )

    assert blocked.status_code == 403
    assert accepted.status_code == 204
