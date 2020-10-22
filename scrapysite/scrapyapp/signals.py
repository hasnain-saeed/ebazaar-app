from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

from scrapyapp.tasks import send_email_to_subscribers
from scrapyapp.models import Product, Subscriber


@receiver(pre_save, sender=Product)
def update_product(sender, instance, **kwargs):
    product = Product.products.filter(retailer_sku=instance.retailer_sku)
    if product:
        prev_is_out_of_stock = product.first().is_out_of_stock
        if prev_is_out_of_stock and not instance.is_out_of_stock:
            subscriber_list = list(Subscriber.objects.filter(product=instance).values_list('email', flat=True))

            if subscriber_list:
                context = {
                    'name': instance.name,
                }
                html_message = render_to_string('ecommerce/email/in_stock_message.html', context=context)
                plain_message = strip_tags(html_message)
                subject = f'{instance.name} is now AVAILABLE'
                send_email_to_subscribers.delay(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    subscriber_list,
                    html_message
                )
