import operator
from functools import reduce

from django.shortcuts import render
from django.db.models import Q
from django.urls import reverse
from django.views.generic import ListView, DetailView, UpdateView, CreateView
from django.http import HttpResponseRedirect
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

from scrapyapp.forms import ProductUpdateForm, ProductSubscriptionForm
from scrapyapp.models import Product, ProductImage, ProductUnit, Subscriber, Brand, Category
from scrapyapp.tasks import send_email_to_subscribers
from scrapyapp.constants import MEN, WOMEN, gender_map


class ProductListView(ListView):
    model = Product
    template_name = 'ecommerce/products_home.html'

    def get_context_data(self, **kwargs):
        context = super(ProductListView, self).get_context_data()
        user = self.request.user

        qs = self.get_queryset().prefetch_related('images')
        if user.is_authenticated and user.is_staff:
            featured_products = qs.filter(is_featured=True)
            men_products = qs.filter(gender=MEN)
            women_products = qs.filter(gender=WOMEN)
        else:
            featured_products = qs.filter(is_featured=True, is_active=True)
            men_products = qs.filter(gender=MEN, is_active=True)
            women_products = qs.filter(gender=WOMEN, is_active=True)

        context['featured_products'] = featured_products
        context['men_products'] = men_products
        context['women_products'] = women_products

        return context


class ProductDetailView(DetailView):
    model = Product
    template_name = 'ecommerce/product_detail.html'
    context_object_name = 'product'
    slug_field = 'retailer_sku'
    slug_url_kwarg = 'prod_id'

    def get_context_data(self, **kwargs):
        context = super(ProductDetailView, self).get_context_data()
        details = ProductDetailView.get_details(self.object)
        context.update(details)
        context['subscriber_form'] = ProductSubscriptionForm()
        return context

    @staticmethod
    def get_details(product):
        details = {}
        description = product.description.split('|')
        if description:
            details['description'] = description[0]
            if len(description) > 1:
                more_info = description[1:]
                details['table'] = zip(more_info[0::2], more_info[1::2])

        skus = ProductUnit.objects.filter(product=product).only('size')
        details['sizes'] = [sku.size for sku in skus]
        details['product_form'] = ProductUpdateForm(instance=product)
        return details


class ProductUpdateView(UpdateView):
    model = Product
    form_class = ProductUpdateForm
    slug_field = 'retailer_sku'
    slug_url_kwarg = 'prod_id'

    def get_success_url(self):
        return reverse('product-detail', kwargs={'prod_id': self.object.retailer_sku})

    def get_form(self, form_class=None):
        form = super(ProductUpdateView, self).get_form()

        if form.is_valid() and form.has_changed():
            is_out_of_stock = form.cleaned_data.get('is_out_of_stock')

            if 'is_out_of_stock' in form.changed_data and not is_out_of_stock:
                subscriber_list = list(Subscriber.objects.filter(product=self.object).values_list('email', flat=True))

                if subscriber_list:
                    context = {
                        'name': self.object.name,
                    }
                    html_message = render_to_string('ecommerce/email/in_stock_message.html', context=context)
                    plain_message = strip_tags(html_message)
                    subject = f'{self.object.name} is now AVAILABLE'
                    send_email_to_subscribers.delay(
                        subject,
                        plain_message,
                        settings.DEFAULT_FROM_EMAIL,
                        subscriber_list,
                        html_message
                    )
        return form


class ProductCategoryListView(ListView):
    model = Product
    template_name = 'ecommerce/product_category.html'
    context_object_name = 'products'
    paginate_by = 20

    def get_queryset(self):
        qs = super(ProductCategoryListView, self).get_queryset()
        if not self.request.user.is_authenticated:
            qs = qs.filter(is_active=True)
        return qs

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(ProductCategoryListView, self).get_context_data()
        brands = self.request.GET.getlist('brand')
        categories = self.request.GET.getlist('category')
        qs = super().get_queryset()

        exclude_brand = Q(brand__name=self.kwargs.get('slug'))
        exclude_category = Q(category__name=self.kwargs.get('slug'))
        context['category_types'] = qs.exclude(
            Q(category__isnull=True) | exclude_category).values_list('category__name', flat=True).distinct()
        context['brands'] = qs.exclude(
            Q(brand__isnull=True) | exclude_brand).values_list('brand__name', flat=True).distinct()

        params = ''.join(['&brand=' + brand for brand in brands]) + \
                 ''.join(['&category=' + category for category in categories])
        context['params'] = params.replace(' ', '+')
        return context

    def filter_brands_and_categories(self, queryset):
        brands = self.request.GET.getlist('brand')
        categories = self.request.GET.getlist('category')
        if brands or categories:
            brand_categories_filters = ProductCategoryListView.get_filter_set(brands, categories)
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


class ProductFeaturedView(ProductCategoryListView):
    def get_queryset(self):
        qs = super(ProductFeaturedView, self).get_queryset()
        qs = qs.filter(is_featured=True)
        self.queryset = qs
        qs = super().filter_brands_and_categories(qs)
        return qs.prefetch_related('images')


class ProductGenderView(ProductCategoryListView):
    def get_queryset(self):
        qs = super(ProductGenderView, self).get_queryset()
        slug_url = self.kwargs.get('slug')
        qs = qs.filter(gender=gender_map.get(slug_url))
        self.queryset = qs
        qs = super().filter_brands_and_categories(qs)
        return qs.prefetch_related('images')


class ProductBrandView(ProductCategoryListView):
    def get_queryset(self):
        qs = super(ProductBrandView, self).get_queryset()
        qs = qs.filter(brand__name=self.kwargs.get('slug'))
        self.queryset = qs
        qs = super().filter_brands_and_categories(qs)
        return qs.prefetch_related('images')


class ProductCategoryView(ProductCategoryListView):
    def get_queryset(self):
        qs = super(ProductCategoryView, self).get_queryset()
        qs = qs.filter(category__name=self.kwargs.get('slug'))
        self.queryset = qs
        qs = super().filter_brands_and_categories(qs)
        return qs.prefetch_related('images')


class ProductSubscribeView(CreateView):
    model = Subscriber
    form_class = ProductSubscriptionForm

    def post(self, request, *args, **kwargs):
        product = Product.products.get(retailer_sku=self.kwargs.get('prod_id'))
        data = request.POST.copy()
        data['product'] = str(product.id)
        form = ProductSubscriptionForm(data)

        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('product-detail', kwargs={'prod_id': product.retailer_sku}))
        else:
            context = ProductDetailView.get_details(product)
            context.update({'product': product, 'subscriber_form': form})
            return render(request, 'ecommerce/product_detail.html', context)


class CategoryListView(ListView):
    model = Category
    template_name = 'ecommerce/category_list.html'
    context_object_name = 'categories'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(CategoryListView, self).get_context_data()
        categories_list = []

        for category in context['categories']:
            categories_list.append({
                'name': category.name,
                'image': ProductImage.objects.filter(product__category=category).first()
            })

        context['categories'] = categories_list
        return context


class BrandListView(ListView):
    model = Brand
    template_name = 'ecommerce/category_list.html'
    context_object_name = 'brands'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(BrandListView, self).get_context_data()
        brands_list = []

        for brand in context['brands']:
            brands_list.append({
                'name': brand.name,
                'image': ProductImage.objects.filter(product__brand=brand).first()
            })

        context['brands'] = brands_list
        return context
