release: python3 manage.py makemigrations --no-input
release: python3 manage.py migrate

web: gunicorn scrapysite.wsgi --log-file -
worker: celery -A scrapysite worker -l info
beat: celery -A scrapysite beat -l info -S celerybeat-schedule
