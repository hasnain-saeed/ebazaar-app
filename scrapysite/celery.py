from __future__ import absolute_import
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scrapysite.settings')
app = Celery('scrapysite')
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


app.conf.beat_schedule = {
    'run_spider_every_hour': {
        'task': 'scrapyapp.tasks.run_spider',
        'schedule': crontab(hour=12, minute=23, day_of_week=4),
        'args': ()
    },
}
# celery -A scrapysite worker -l debug -B -s /home/hasnainsaeed/Desktop/Django/djangospider/celerybeat-schedule
