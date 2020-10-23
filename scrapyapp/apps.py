from django.apps import AppConfig


class EbazaarConfig(AppConfig):
    name = 'scrapyapp'

    def ready(self):
        import scrapyapp.signals