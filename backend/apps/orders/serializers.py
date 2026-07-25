from rest_framework import serializers

from apps.catalog.models import Product
from .models import Order, OrderItem


class CustomerSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)


class ProductSummarySerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(read_only=True, slug_field="slug")

    class Meta:
        model = Product
        fields = ["id", "name", "category", "image"]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSummarySerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price", "line_total"]

    def get_line_total(self, item: OrderItem) -> str:
        return f"{item.price * item.quantity:.2f}"


class OrderListSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()
    items_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "items_count",
            "total",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_customer(self, order: Order) -> dict[str, str]:
        if not order.user:
            return {"name": "Guest customer", "email": ""}
        name = order.user.get_full_name().strip() or order.user.email
        return {"name": name, "email": order.user.email}


class OrderDetailSerializer(OrderListSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta(OrderListSerializer.Meta):
        fields = [*OrderListSerializer.Meta.fields, "items"]


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]


class OrderFilterSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=Order.Status.choices, required=False, allow_blank=True
    )
    search = serializers.CharField(required=False, allow_blank=True, max_length=200)
    customer = serializers.CharField(required=False, allow_blank=True, max_length=200)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)

    def validate(self, attrs):
        if attrs.get("date_from") and attrs.get("date_to"):
            if attrs["date_from"] > attrs["date_to"]:
                raise serializers.ValidationError(
                    {"date_to": "Must be on or after the start date."}
                )
        return attrs
