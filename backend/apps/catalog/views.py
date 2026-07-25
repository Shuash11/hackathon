from django.db.models import Count
from rest_framework.generics import ListAPIView

from .models import Category
from .serializers import CategorySerializer


class CategoryListView(ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.annotate(product_count=Count("products")).order_by("id")
