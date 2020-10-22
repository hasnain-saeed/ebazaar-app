release: python3 scrapysite/manage.py makemigrations --no-input
release: python3 scrapysite/manage.py migrate

web: gunicorn scrapysite.scrapysite.wsgi --log-file -
worker: celery -A scrapysite/scrapysite worker -l info
beat: celery -A scrapysite/scrapysite beat -l info -S celerybeat-schedule
