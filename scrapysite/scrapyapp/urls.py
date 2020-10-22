from django.urls import path
from scrapyapp import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-home'),
    path('featured/', views.ProductFeaturedView.as_view(), name='featured-products'),
    path('brands/', views.BrandListView.as_view(), name='brand-list'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('gender/<slug:slug>/', views.ProductGenderView.as_view(), name='gender-products'),
    path('brands/<str:slug>/', views.ProductBrandView.as_view(), name='brands-products'),
    path('categories/<str:slug>/', views.ProductCategoryView.as_view(), name='categories-products'),
    path('products/<slug:prod_id>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<slug:prod_id>/update', views.ProductUpdateView.as_view(), name='product-update'),
    path('products/<slug:prod_id>/subscribe', views.ProductSubscribeView.as_view(), name='product-subscribe')
]
