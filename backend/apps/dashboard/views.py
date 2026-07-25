from decimal import Decimal

from django.db.models import Count, DecimalField, IntegerField, Q, Sum, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Category, Product
from apps.orders.models import Order
from apps.orders.serializers import OrderListSerializer


class AnalyticsSummaryView(APIView):
    def get(self, request):
        month_start = timezone.now().replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        active_orders = Order.objects.exclude(status=Order.Status.CANCELLED)
        revenue_output = DecimalField(max_digits=14, decimal_places=2)
        total_revenue = active_orders.aggregate(
            value=Coalesce(
                Sum("total"), Value(Decimal("0.00")), output_field=revenue_output
            )
        )["value"]
        revenue_this_month = active_orders.filter(
            created_at__gte=month_start
        ).aggregate(
            value=Coalesce(
                Sum("total"), Value(Decimal("0.00")), output_field=revenue_output
            )
        )[
            "value"
        ]
        sale_statuses = [
            status
            for status, _ in Order.Status.choices
            if status != Order.Status.CANCELLED
        ]
        categories = Category.objects.annotate(
            order_count=Count(
                "products__order_items__order",
                filter=Q(products__order_items__order__status__in=sale_statuses),
                distinct=True,
            )
        ).order_by("id")
        best_sellers = (
            Product.objects.select_related("category")
            .annotate(
                quantity_sold=Coalesce(
                    Sum(
                        "order_items__quantity",
                        filter=Q(order_items__order__status__in=sale_statuses),
                    ),
                    0,
                    output_field=IntegerField(),
                )
            )
            .filter(quantity_sold__gt=0)
            .order_by("-quantity_sold", "name")[:5]
        )
        recent_orders = (
            Order.objects.select_related("user")
            .annotate(
                items_count=Coalesce(
                    Sum("items__quantity"), 0, output_field=IntegerField()
                )
            )
            .order_by("-created_at")[:7]
        )
        low_stock = Product.objects.select_related("category").filter(stock__lte=5)[:5]

        return Response(
            {
                "total_products": Product.objects.count(),
                "total_orders": Order.objects.count(),
                "orders_this_month": Order.objects.filter(
                    created_at__gte=month_start
                ).count(),
                "total_revenue": f"{total_revenue:.2f}",
                "revenue_this_month": f"{revenue_this_month:.2f}",
                "orders_by_category": [
                    {
                        "name": category.name,
                        "slug": category.slug,
                        "order_count": category.order_count,
                    }
                    for category in categories
                ],
                "best_sellers": [
                    {
                        "id": product.id,
                        "name": product.name,
                        "category": product.category.name,
                        "quantity_sold": product.quantity_sold,
                        "stock": product.stock,
                    }
                    for product in best_sellers
                ],
                "recent_orders": OrderListSerializer(recent_orders, many=True).data,
                "low_stock": [
                    {
                        "id": product.id,
                        "name": product.name,
                        "category": product.category.name,
                        "stock": product.stock,
                    }
                    for product in low_stock
                ],
            }
        )
