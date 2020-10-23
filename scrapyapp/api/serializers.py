from abc import ABCMeta

from rest_framework import serializers
from scrapyapp.models import Product, ProductUnit, Brand, Category, ProductImage, Subscriber


class ProductUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductUnit
        fields = ['sku_id', 'currency', 'price', 'size', 'is_out_of_stock']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image_file']


class ProductDetailSerializer(serializers.ModelSerializer):
    gender = serializers.ReadOnlyField(source='get_gender_display')
    brand = serializers.ReadOnlyField(source='brand.name')
    category = serializers.ReadOnlyField(source='category.name')
    skus = ProductUnitSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['name', 'original_url', 'spider_name', 'retailer_sku', 'description']
        depth = 1


class ProductListSerializer(serializers.ModelSerializer):
    gender = serializers.CharField(source='get_gender_display')
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['retailer_sku', 'name', 'gender',  'is_out_of_stock', 'images']
        depth = 1


class BrandsListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Brand
        fields = ['name', 'image']

    def get_image_url(self, brand_name):
        request = self.context.get('request')
        image = ProductImage.objects.filter(product__brand__name=brand_name).first()
        return request.build_absolute_uri(image.image_file.url)


class CategoryListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Category
        fields = ['name', 'image']

    def get_image_url(self, category_name):
        request = self.context.get('request')
        image = ProductImage.objects.filter(product__category__name=category_name).first()
        return request.build_absolute_uri(image.image_file.url)


class ProductSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ['product', 'email']
        extra_kwargs = {'email': {'required': True}}

    def validate_product(self, product):
        if not product.is_out_of_stock:
            raise serializers.ValidationError('Product is not out of stock')
        return product


class StringListSerializer(serializers.ListSerializer):
    child = serializers.CharField(max_length=30)


class BrandCategoriesSerializer(serializers.Serializer):
    brands = StringListSerializer()
    categories = StringListSerializer()

