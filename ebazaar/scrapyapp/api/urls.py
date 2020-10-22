from django.urls import path, include

from scrapyapp.api import views

products = views.ProductViewSet.as_view({'get': 'list'})
product_detail = views.ProductViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})
gender_products = views.ProductViewSet.as_view({'get': 'list_gender_products'})
brands_categories_in_gender = views.ProductViewSet.as_view({'get': 'list_brands_categories_in_gender'})
subscribe_product = views.ProductViewSet.as_view({'post': 'subscribe'})
brands = views.BrandViewSet.as_view({'get': 'list'})
brand_products = views.BrandViewSet.as_view({'get': 'list_brand_products'})
categories_in_brands = views.BrandViewSet.as_view({'get': 'list_categories_in_brands'})
categories = views.CategoryViewSet.as_view({'get': 'list'})
category_products = views.CategoryViewSet.as_view({'get': 'list_category_products'})
brands_in_categories = views.CategoryViewSet.as_view({'get': 'list_brands_in_categories'})
brands_categories_in_featured = views.FeaturedViewSet.as_view({'get': 'list_brands_categories_in_featured'})

urlpatterns = [
    path('featured/', views.FeaturedViewSet.as_view({'get': 'list'}), name='featured-list'),
    path('featured/brands-categories', brands_categories_in_featured, name='brands-categories-in-featured'),
    path('products/', products, name='products-list'),
    path('products/<slug:prod_id>/', product_detail, name='product-detail'),
    path('products/<slug:prod_id>/subscribe', subscribe_product, name='subscribe-product'),
    path('genders/<str:gender>', gender_products, name='gender-products'),
    path('genders/<str:gender>/brands-categories', brands_categories_in_gender, name='brands-categories-in-gender'),
    path('brands/', brands, name='brands-list'),
    path('brands/<str:brand>/', brand_products, name='brand-products-list'),
    path('brands/<str:brand>/categories', categories_in_brands, name='categories-in-brands'),
    path('categories/', categories, name='brands-list'),
    path('categories/<str:category>/', category_products, name='category-products-list'),
    path('categories/<str:category>/brands', brands_in_categories, name='brands-in-categories'),
]

