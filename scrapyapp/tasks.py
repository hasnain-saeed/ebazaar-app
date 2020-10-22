import os
import time

import celery
from celery import shared_task
from django.core.mail import send_mail
from django.core import management
from scrapy.crawler import CrawlerProcess
from scrapy.settings import Settings
from scrapy.utils.project import get_project_settings

from crawler.crawler.spiders import jacklemkus_spider


@shared_task
def send_email_to_subscribers(subject, plain_message, from_email, subscriber_list, html_message):
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=from_email,
        recipient_list=subscriber_list,
        html_message=html_message,
        fail_silently=False,
    )


@celery.task
def run_spider():
    try:
        management.call_command('clearsessions')
        os.environ['SCRAPY_SETTINGS_MODULE'] = 'crawler.crawler.settings'
        process = CrawlerProcess(get_project_settings())
        process.crawl(jacklemkus_spider.JacklemkusSpider)
        process.start()
        return "success"
    except Exception as e:
        print(e)
