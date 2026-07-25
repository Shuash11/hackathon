from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import Category, Product
from apps.orders.models import Order, OrderItem
from apps.users.models import User


@pytest.fixture
def analytics_data(api_client):
    owner = User.objects.create_user("owner@example.com")
    customer = User.objects.create_user("customer@example.com")
    api_client.cookies["access_token"] = str(
        RefreshToken.for_user(owner).access_token
    )
    summer = Category.objects.get(slug="summer")
    winter = Category.objects.get(slug="winter")
    citrus = Product.objects.create(
        name="Citrus Tide", category=summer, price="50.00", stock=3
    )
    amber = Product.objects.create(
        name="Amber Hearth", category=winter, price="75.00", stock=18
    )
    delivered = Order.objects.create(
        user=customer, status="delivered", total="175.00"
    )
    OrderItem.objects.create(
        order=delivered, product=citrus, quantity=2, price="50.00"
    )
    OrderItem.objects.create(
        order=delivered, product=amber, quantity=1, price="75.00"
    )
    Order.objects.filter(pk=delivered.pk).update(
        created_at=timezone.now() - timedelta(minutes=1)
    )
    cancelled = Order.objects.create(
        user=customer, status="cancelled", total="500.00"
    )
    OrderItem.objects.create(
        order=cancelled, product=amber, quantity=5, price="100.00"
    )
    old = Order.objects.create(user=customer, status="shipped", total="50.00")
    OrderItem.objects.create(order=old, product=citrus, quantity=1, price="50.00")
    Order.objects.filter(pk=old.pk).update(
        created_at=timezone.now() - timedelta(days=45)
    )
    return api_client, delivered


@pytest.mark.django_db
def test_analytics_summary_requires_authentication(api_client):
    response = api_client.get(reverse("analytics-summary"))

    assert response.status_code == 401


@pytest.mark.django_db
def test_analytics_summary_aggregates_dashboard_metrics(analytics_data):
    client, delivered = analytics_data

    response = client.get(reverse("analytics-summary"))

    assert response.status_code == 200
    assert response.data["total_products"] == 2
    assert response.data["total_orders"] == 3
    assert response.data["orders_this_month"] == 2
    assert response.data["total_revenue"] == "225.00"
    assert response.data["revenue_this_month"] == "175.00"
    assert response.data["best_sellers"][0]["name"] == "Citrus Tide"
    assert response.data["best_sellers"][0]["quantity_sold"] == 3
    assert response.data["recent_orders"][0]["id"] != delivered.id
    assert response.data["low_stock"][0]["name"] == "Citrus Tide"
    breakdown = {row["slug"]: row["order_count"] for row in response.data["orders_by_category"]}
    assert breakdown["summer"] == 2
    assert breakdown["winter"] == 1
