import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_health_endpoint_is_public_and_sets_csrf_cookie(api_client):
    response = api_client.get(reverse("health"))

    assert response.status_code == 200
    assert response.data == {"status": "ok"}
    assert "csrftoken" in response.cookies
