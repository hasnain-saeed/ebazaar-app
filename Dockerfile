FROM python:3.8
WORKDIR /djangospider/scrapysite
COPY requirements.txt /djangospider/scrapysite
RUN pip3 install --upgrade pip -r requirements.txt
COPY . /djangospider/scrapysite
EXPOSE 8000
CMD python3 manage.py runserver 0.0.0.0:8000
