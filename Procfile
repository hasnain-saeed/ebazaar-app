release: python3 ebazaar/manage.py makemigrations --no-input
release: python3 ebazaar/manage.py migrate

web: gunicorn scrapysite.wsgi --log-file -
worker: celery -A scrapysite worker -l info
beat: celery -A scrapysite beat -l info -S celerybeat-schedule
