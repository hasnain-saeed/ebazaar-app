from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.loader import ItemLoader

from crawler.crawler.items import Product
from crawler.crawler.utils import get_price_in_cents, get_gender, is_product_exists, get_currency
from crawler.crawler.constants import category_labels


class JacklemkusSpider(CrawlSpider):
    name = 'jacklemkus'
    allowed_domains = ['jacklemkus.com']
    start_urls = ['https://www.jacklemkus.com/']
    rules = [
        Rule(LinkExtractor(restrict_css=['#nav', '.pagination'])),
        Rule(LinkExtractor(restrict_css='#products-grid'), callback='parse_product')
    ]
    seen_retailer_sku = set()

    def parse_product(self, response):
        retailer_sku = response.css('.prod-sku .sku::text').get()
        if is_product_exists(self.seen_retailer_sku, retailer_sku):
            return

        gender, category, brand = self.get_more_info(response)
        description = self.get_description(response)
        product_item = ItemLoader(Product(), response=response)
        product_item.add_value('original_url', response.url)
        product_item.add_value('spider_name', self.name)
        product_item.add_css('name', '.product-name h1::text')
        product_item.add_value('retailer_sku', retailer_sku)
        product_item.add_value('gender', gender)
        product_item.add_value('category', category)
        product_item.add_value('brand', brand)
        product_item.add_value('description', description)
        product_item.add_value('skus', self.get_skus(response))
        product_item.add_css('image_urls', '.product-image-wrapper a::attr(href)')
        return product_item.load_item()

    def get_description(self, response):
        css = '#description-tab .std::text, #more-info-tab .data-table tbody *::text'
        return '|'.join([d.strip() for d in response.css(css).getall() if d.strip()])

    def get_skus(self, response):
        product_variants = dict(eval(response.css('.product-data-mine').attrib['data-lookup']))
        raw_price = response.css('.price::text').get()
        currency = get_currency(raw_price)
        skus = []

        for variant in product_variants.values():
            sku = {'sku_id': variant['id'],
                   'size': variant['size'],
                   'price': get_price_in_cents(raw_price),
                   'currency': currency}
            if not variant['stock_status']:
                sku['out_of_stock'] = True
            skus.append(sku)

        return skus

    def get_more_info(self, response):
        raw_gender_text = self.get_label_data(response, "Gender")
        gender = get_gender(raw_gender_text)
        brand = self.get_label_data(response, "Item Brand") or ''
        category = self.get_category(response) or ''
        return gender, category, brand

    def get_label_data(self, response, label):
        return response.css(f'#more-info-tab .data-table tbody tr th:contains("{label}") + td::text').get()

    def get_category(self, response):
        for label in category_labels:
            category = self.get_label_data(response, label)
            if category:
                if category == 'FOOTWARE':
                    category = 'Sneakers'
                if '/' in category:
                    category = category.split('/').pop[0]
                return category.split(',')[0]
