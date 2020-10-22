
import os

from django.core.wsgi import get_wsgi_application
import whitenoise.django import DjangoWhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scrapysite.settings')

application = get_wsgi_application()
application = DjangoWhiteNoise(application)
