from scrapyapp.models import Brand, Category, Product, ProductImage, ProductUnit
from scrapyapp.constants import gender_map


class CrawlerPipeline:
    def process_item(self, item, spider):
        retailer_sku = item['retailer_sku']
        if Product.products.filter(retailer_sku=retailer_sku).exists():
            return item

        gender = item['gender']
        product = Product(
            original_url=item['original_url'],
            spider_name=item['spider_name'],
            name=item['name'],
            retailer_sku=retailer_sku,
            gender=gender_map[gender],
            description=item['description']
        )

        if 'brand' in item.keys() and item['brand']:
            product.brand, _ = Brand.objects.get_or_create(name=item['brand'])

        if 'category' in item.keys() and item['category']:
            product.category, _ = Category.objects.get_or_create(name=item['category'])

        product.save()

        skus = []
        for sku in item['skus']:
            product_unit = ProductUnit(
                product=product,
                sku_id=sku['sku_id'],
                currency=sku['currency'],
                price=sku['price'],
                size=sku['size']
            )
            if 'out_of_stock' in sku.keys():
                product_unit.is_out_of_stock = sku['out_of_stock']
            skus.append(product_unit)

        ProductUnit.objects.bulk_create(skus)

        for url in item['image_urls']:
            img = ProductImage(product=product, url=url)
            img.save()

        return item
