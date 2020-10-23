import operator
from functools import reduce

from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.db.models import Q

from scrapyapp.models import Product, Brand, Category
from scrapyapp.api import serializers
from scrapyapp.constants import gender_map
from scrapyapp.api.permissions import IsStaffAuthenticatedOrReadOnly, IsNotStaffAuthenticated


class ProductViewSet(ModelViewSet):
    queryset = Product.products.all()
    lookup_field = 'retailer_sku'
    lookup_url_kwarg = 'prod_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsStaffAuthenticatedOrReadOnly]
    permission_classes_by_action = {'subscribe': [IsNotStaffAuthenticated]}

    def get_queryset(self):
        qs = super(ProductViewSet, self).get_queryset()
        if not self.request.user.is_authenticated:
            qs = qs.filter(is_active=True)
        return qs.prefetch_related('images')

    @action(detail=False)
    def list_gender_products(self, request, gender=None):
        gender_products = Product.products.filter_gender(gender_map.get(gender))
        if not self.request.user.is_authenticated:
            gender_products = gender_products.filter(is_active=True)
        brands = self.request.query_params.getlist('brand')
        categories = self.request.query_params.getlist('category')
        gender_products = ProductViewSet.filter_brands_and_categories(brands, categories, gender_products).\
            prefetch_related('images')
        page = self.paginate_queryset(gender_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(gender_products, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def list_brands_categories_in_gender(self, request, gender=None):
        gender_products = Product.products.filter_gender(gender_map.get(gender))
        if not self.request.user.is_authenticated:
            gender_products = gender_products.filter(is_active=True)

        brands = gender_products.exclude(
            Q(brand__isnull=True)).values_list('brand__name', flat=True).distinct()
        categories = gender_products.exclude(
            Q(category__isnull=True)).values_list('category__name', flat=True).distinct()
        serializer = self.get_serializer({
            'brands': brands,
            'categories': categories
        })
        return Response(serializer.data)

    @action(detail=False)
    def subscribe(self, request, prod_id=None):
        serializer = self.get_serializer(data={
            'product': Product.products.get(retailer_sku=prod_id).id,
            'email': request.POST.get('email')
        }, many=False)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @staticmethod
    def filter_brands_and_categories(brands, categories, queryset):
        if brands or categories:
            brand_categories_filters = ProductViewSet.get_filter_set(brands, categories)
            queryset = queryset.filter(brand_categories_filters)
        return queryset

    @staticmethod
    def get_filter_set(brands, categories):
        cumulative_query = Q()
        if brands:
            queries = [Q(brand__name=value) for value in brands]
            cumulative_query = reduce(operator.or_, queries)

        if categories:
            queries = [Q(category__name=value) for value in categories]
            cumulative_query &= reduce(operator.or_, queries)

        return cumulative_query

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'list_gender_products':
            return serializers.ProductListSerializer
        elif self.action == 'subscribe':
            return serializers.ProductSubscribeSerializer
        elif self.action == 'list_brands_categories_in_gender':
            return serializers.BrandCategoriesSerializer
        return serializers.ProductDetailSerializer

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class FeaturedViewSet(ReadOnlyModelViewSet):
    queryset = Product.featured_products.all()
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        qs = super(FeaturedViewSet, self).get_queryset()
        if not self.request.user.is_authenticated:
            qs = qs.filter(is_active=True)

        brands = self.request.query_params.getlist('brand')
        categories = self.request.query_params.getlist('category')
        qs = ProductViewSet.filter_brands_and_categories(brands, categories, qs)
        return qs.prefetch_related('images')

    @action(detail=False)
    def list_brands_categories_in_featured(self, request):
        featured_products = Product.featured_products.all()
        if not self.request.user.is_authenticated:
            featured_products = featured_products.filter(is_active=True)

        brands = featured_products.exclude(
            Q(brand__isnull=True)).values_list('brand__name', flat=True).distinct()
        categories = featured_products.exclude(
            Q(category__isnull=True)).values_list('category__name', flat=True).distinct()
        serializer = self.get_serializer({
            'brands': brands,
            'categories': categories
        })
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'list_brands_categories_in_featured':
            return serializers.BrandCategoriesSerializer
        return serializers.ProductListSerializer


class BrandViewSet(ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = serializers.BrandsListSerializer
    lookup_url_kwarg = 'brand'
    authentication_classes = [TokenAuthentication]

    @action(detail=False)
    def list_brand_products(self, request, brand=None):
        brand_products = Product.products.filter_brand(brand)
        if not self.request.user.is_authenticated:
            brand_products = brand_products.filter(is_active=True)

        brands = self.request.query_params.getlist('brand')
        categories = self.request.query_params.getlist('category')
        brand_products = ProductViewSet.filter_brands_and_categories(brands, categories, brand_products)\
            .prefetch_related('images')

        page = self.paginate_queryset(brand_products)
        if page is not None:
            serializer = self.get_serializer(page, context={'request': self.request}, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(brand_products, context={'request': self.request}, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def list_categories_in_brands(self, request, brand=None):
        brand_products = Product.products.filter_brand(brand)
        if not self.request.user.is_authenticated:
            brand_products = brand_products.filter(is_active=True)

        categories = brand_products.exclude(
            Q(category__isnull=True)).values_list('category__name', flat=True).distinct()
        serializer = self.get_serializer(categories)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'list_brand_products':
            return serializers.ProductListSerializer
        elif self.action == 'list_categories_in_brands':
            return serializers.StringListSerializer
        return serializers.BrandsListSerializer


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = serializers.CategoryListSerializer
    lookup_url_kwarg = 'category'
    authentication_classes = [TokenAuthentication]

    @action(detail=False)
    def list_category_products(self, request, category=None):
        category_products = Product.products.filter_category(category)
        if not self.request.user.is_authenticated:
            category_products = category_products.filter(is_active=True)

        brands = self.request.query_params.getlist('brand')
        categories = self.request.query_params.getlist('category')
        category_products = ProductViewSet.filter_brands_and_categories(brands, categories, category_products).\
            prefetch_related('images')

        page = self.paginate_queryset(category_products)
        if page is not None:
            serializer = self.get_serializer(page, context={'request': self.request}, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(category_products, context={'request': self.request}, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def list_brands_in_categories(self, request, category=None):
        category_products = Product.products.filter_category(category)
        if not self.request.user.is_authenticated:
            category_products = category_products.filter(is_active=True)

        brands = category_products.exclude(
            Q(brand__isnull=True)).values_list('brand__name', flat=True).distinct()
        serializer = self.get_serializer(brands)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'list_category_products':
            return serializers.ProductListSerializer
        elif self.action == 'list_brands_in_categories':
            return serializers.StringListSerializer
        return serializers.CategoryListSerializer
