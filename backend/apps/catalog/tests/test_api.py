import pytest
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import Category, Product
from apps.users.models import User


@pytest.fixture
def authenticated_client(api_client):
    user = User.objects.create_user("owner@example.com")
    api_client.cookies["access_token"] = str(RefreshToken.for_user(user).access_token)
    return api_client


@pytest.mark.django_db
def test_category_list_requires_authentication(api_client):
    response = api_client.get(reverse("category-list"))

    assert response.status_code == 401


@pytest.mark.django_db
def test_category_list_returns_fixed_categories_with_product_counts(authenticated_client):
    male = Category.objects.get(slug="male")
    Product.objects.create(name="Cedar No. 7", category=male, price="89.00", stock=12)
    Product.objects.create(name="Night Atlas", category=male, price="110.00", stock=7)

    response = authenticated_client.get(reverse("category-list"))

    assert response.status_code == 200
    assert [category["slug"] for category in response.data] == [
        "male",
        "female",
        "summer",
        "winter",
    ]
    assert response.data[0]["product_count"] == 2
    assert response.data[1]["product_count"] == 0
