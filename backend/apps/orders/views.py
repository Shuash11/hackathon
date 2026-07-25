from django.db.models import IntegerField, Q, Sum
from django.db.models.functions import Coalesce
from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Order
from .pagination import OrderPagination
from .serializers import (
    OrderDetailSerializer,
    OrderFilterSerializer,
    OrderListSerializer,
    OrderStatusUpdateSerializer,
)


class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "patch", "delete", "head", "options"]
    pagination_class = OrderPagination

    def get_queryset(self):
        filters = OrderFilterSerializer(data=self.request.query_params)
        filters.is_valid(raise_exception=True)
        values = filters.validated_data
        queryset = (
            Order.objects.select_related("user")
            .prefetch_related("items__product__category")
            .annotate(
                items_count=Coalesce(
                    Sum("items__quantity"), 0, output_field=IntegerField()
                )
            )
        )
        if values.get("status"):
            queryset = queryset.filter(status=values["status"])
        search = values.get("search") or values.get("customer")
        if search:
            queryset = queryset.filter(
                Q(user__email__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
            )
        if values.get("date_from"):
            queryset = queryset.filter(created_at__date__gte=values["date_from"])
        if values.get("date_to"):
            queryset = queryset.filter(created_at__date__lte=values["date_to"])
        return queryset.order_by("-created_at")

    def get_serializer_class(self):
        if self.action == "list":
            return OrderListSerializer
        if self.action == "partial_update":
            return OrderStatusUpdateSerializer
        return OrderDetailSerializer

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        refreshed = self.get_queryset().get(pk=order.pk)
        detail = OrderDetailSerializer(
            refreshed, context=self.get_serializer_context()
        ).data
        return Response(detail, status=status.HTTP_200_OK)
