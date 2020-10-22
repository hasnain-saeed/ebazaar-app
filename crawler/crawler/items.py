from scrapy import Item, Field
from itemloaders.processors import MapCompose, TakeFirst


class Product(Item):
    original_url = Field(output_processor=TakeFirst())
    spider_name = Field(output_processor=TakeFirst())
    name = Field(input_processor=MapCompose(str.strip), output_processor=TakeFirst())
    retailer_sku = Field(input_processor=MapCompose(str.strip), output_processor=TakeFirst())
    gender = Field(output_processor=TakeFirst())
    category = Field(output_processor=TakeFirst())
    brand = Field(output_processor=TakeFirst())
    description = Field(output_processor=TakeFirst())
    skus = Field()
    image_urls = Field()
