from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import Category, Product
from apps.orders.models import Order, OrderItem
from apps.users.models import User


@pytest.fixture
def order_data(api_client):
    owner = User.objects.create_user(
        "owner@example.com", first_name="Store", last_name="Owner"
    )
    customer = User.objects.create_user(
        "sasha@example.com", first_name="Sasha", last_name="Reed"
    )
    api_client.cookies["access_token"] = str(
        RefreshToken.for_user(owner).access_token
    )
    category = Category.objects.get(slug="female")
    product = Product.objects.create(
        name="Velvet Iris", category=category, price="72.50", stock=20
    )
    shipped = Order.objects.create(user=customer, status="shipped", total="145.00")
    OrderItem.objects.create(
        order=shipped, product=product, quantity=2, price="72.50"
    )
    pending = Order.objects.create(user=customer, status="pending", total="72.50")
    OrderItem.objects.create(
        order=pending, product=product, quantity=1, price="72.50"
    )
    old_order = Order.objects.create(user=owner, status="shipped", total="72.50")
    Order.objects.filter(pk=old_order.pk).update(
        created_at=timezone.now() - timedelta(days=45)
    )
    return api_client, shipped, pending


@pytest.mark.django_db
def test_order_list_filters_searches_dates_and_paginates(order_data):
    client, shipped, _ = order_data
    today = timezone.localdate().isoformat()

    response = client.get(
        reverse("order-list"),
        {
            "status": "shipped",
            "search": "Sasha",
            "date_from": today,
            "date_to": today,
            "page_size": 1,
        },
    )

    assert response.status_code == 200
    assert response.data["count"] == 1
    assert response.data["results"][0]["id"] == shipped.id
    assert response.data["results"][0]["items_count"] == 2
    assert response.data["results"][0]["customer"]["name"] == "Sasha Reed"


@pytest.mark.django_db
def test_order_list_rejects_invalid_filters(order_data):
    client, _, _ = order_data

    invalid_status = client.get(reverse("order-list"), {"status": "unknown"})
    invalid_date = client.get(reverse("order-list"), {"date_from": "tomorrow"})

    assert invalid_status.status_code == 400
    assert invalid_status.data["status"][0].code == "invalid_choice"
    assert invalid_date.status_code == 400
    assert invalid_date.data["date_from"][0].code == "invalid"


@pytest.mark.django_db
def test_order_detail_returns_line_items_and_customer(order_data):
    client, shipped, _ = order_data

    response = client.get(reverse("order-detail", args=[shipped.pk]))

    assert response.status_code == 200
    assert response.data["customer"]["email"] == "sasha@example.com"
    assert response.data["items"][0]["product"]["name"] == "Velvet Iris"
    assert response.data["items"][0]["line_total"] == "145.00"


@pytest.mark.django_db
def test_order_status_patch_updates_only_status(order_data):
    client, _, pending = order_data

    response = client.patch(
        reverse("order-detail", args=[pending.pk]),
        {"status": "processing", "total": "1.00"},
        format="json",
    )

    assert response.status_code == 200
    pending.refresh_from_db()
    assert pending.status == "processing"
    assert pending.total == 72.50


@pytest.mark.django_db
def test_order_status_patch_rejects_invalid_transition_value(order_data):
    client, _, pending = order_data

    response = client.patch(
        reverse("order-detail", args=[pending.pk]),
        {"status": "lost"},
        format="json",
    )

    assert response.status_code == 400
    assert response.data["status"][0].code == "invalid_choice"


@pytest.mark.django_db
def test_order_delete_removes_order_and_items(order_data):
    client, shipped, _ = order_data

    response = client.delete(reverse("order-detail", args=[shipped.pk]))

    assert response.status_code == 204
    assert not Order.objects.filter(pk=shipped.pk).exists()
    assert not OrderItem.objects.filter(order_id=shipped.pk).exists()
