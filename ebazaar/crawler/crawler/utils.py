from crawler.crawler.constants import currency_map, gender_map


def get_price_in_cents(raw_price_text):
    raw_price_text = raw_price_text.replace(',', '')
    return float(raw_price_text[1:]) * 100


def get_currency(raw_currency_text):
    for currency, currency_sign in currency_map.items():
        if currency_sign in raw_currency_text:
            return currency


def get_price_and_currency(raw_price_and_currency):
    raw_price_text = ''.join(raw_price_and_currency)
    currency = get_currency(raw_price_text)
    prices = [float(item) for item in raw_price_and_currency if item != currency]
    prices.sort()

    if len(prices) == 1:
        prev_price = new_price = prices.pop()
    else:
        prev_price = prices.pop()
        new_price = prices.pop()

    return new_price, prev_price, currency


def get_gender(raw_gender_text):
    if raw_gender_text:
        raw_gender_text = raw_gender_text.lower()
        for gender, gender_text in gender_map.items():
            if gender_text in raw_gender_text:
                return gender
    return 'unisex'


def is_product_exists(seen_retailer_sku, retailer_sku):
    if retailer_sku in seen_retailer_sku:
        return True
    seen_retailer_sku.add(retailer_sku)
