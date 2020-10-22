import urllib.request
from io import BytesIO
from PIL import Image
from os.path import basename

from django.db import models
from django.core.files.base import ContentFile

from scrapyapp.constants import MEN, WOMEN, GIRLS, BOYS, UNISEX

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')]
urllib.request.install_opener(opener)


class FeaturedProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_featured=True)


class ProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()

    def filter_gender(self, gender):
        return self.get_queryset().filter(gender=gender)

    def filter_brand(self, brand_name):
        return self.get_queryset().filter(brand__name=brand_name)

    def filter_category(self, category_name):
        return self.get_queryset().filter(category__name=category_name)


class ActiveProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

    def filter_featured(self):
        return self.get_queryset().filter(is_featured=True)

    def filter_gender(self, gender):
        return self.get_queryset().filter(gender=gender)


class Brand(models.Model):
    name = models.CharField('Brand Name', max_length=30)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField('Clothing Type', max_length=30)

    def __str__(self):
        return self.name


class Product(models.Model):

    GENDER_CHOICES = [
        (MEN, 'men'),
        (WOMEN, 'women'),
        (GIRLS, 'girls'),
        (BOYS, 'boys'),
        (UNISEX, 'unisex'),
    ]

    original_url = models.CharField('URL', max_length=100, unique=True)
    spider_name = models.CharField('Spider', max_length=20)
    name = models.CharField('Name', max_length=50)
    retailer_sku = models.CharField('Retailer SKU', max_length=20, unique=True)
    gender = models.PositiveSmallIntegerField(choices=GENDER_CHOICES, default=UNISEX)
    description = models.CharField('Description', max_length=512)
    is_featured = models.BooleanField('Featured', default=False)
    is_active = models.BooleanField('Active status', default=True)
    is_out_of_stock = models.BooleanField('Out of stock status', default=False)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    products = ProductManager()
    featured_products = FeaturedProductManager()
    active_products = ActiveProductManager()

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    url = models.URLField('Image URL')
    image_file = models.ImageField(default='default.jpg', upload_to='images')

    def save(self, *args, **kwargs):
        super(ProductImage, self).save(*args, **kwargs)

        if self.url and self.image_file.name == 'default.jpg':
            result = urllib.request.urlretrieve(self.url)
            img_io = BytesIO()
            img = Image.open(result[0])
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size)
                img.save(img_io, format='JPEG', quality=100)

            img_content = ContentFile(img_io.getvalue())
            self.image_file.save(basename(self.url), img_content)

    def __str__(self):
        return self.product.name


class ProductUnit(models.Model):
    product = models.ForeignKey(Product, related_name='skus', on_delete=models.CASCADE)
    sku_id = models.CharField('SKU ID', max_length=20)
    currency = models.CharField('Currency', max_length=5)
    price = models.FloatField('Price')
    size = models.CharField('Size', max_length=20)
    is_out_of_stock = models.BooleanField('Out of stock', default=False, null=True)

    def __str__(self):
        return self.product.name


class Subscriber(models.Model):
    product = models.ForeignKey(Product, related_name='subscribers', on_delete=models.CASCADE)
    email = models.EmailField('Email', max_length=50)

    class Meta:
        unique_together = ('product', 'email')

    def __str__(self):
        return self.email
