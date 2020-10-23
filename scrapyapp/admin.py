from django.contrib import admin
from scrapyapp.models import Brand, Category, Product, ProductImage, ProductUnit, Subscriber

admin.site.register(Product)
admin.site.register(ProductUnit)
admin.site.register(ProductImage)
admin.site.register(Brand)
admin.site.register(Category)
admin.site.register(Subscriber)
