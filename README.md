# Ebazaar

## Table of Contents
* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Native Installation](#native-installation)
  * [Using Docker](#using-docker)
* [Usage](#usage)
  * [Staff User](#staff-user)  
## About the Project
Ebazaar is an ecommerce web application which stores and displays products from another ecommerce website and expose an API. There are two kinds of users: **Customer** and **Staff**.
Customers can view all featured products, brands, categories and their products. Staff users can login to the application and update the product statuses (featured, active and out of stock). A customer can subscribe to a product if it is out of stock and will receive an email once the product item is available.


### Built With
* Django
* Django Rest Framework
* React
* Redux
* Scrapy
* Celery

## Getting Started

### Native Installation
__Prerequisites__

For backend you need to have python and pip installed. If you don't have them installed on your machine, you can easily follow these shell commands on __ubuntu__.
```shell
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo add-apt-repository ppa:deadsnakes/ppa
$ sudo apt update
$ sudo apt install python3.8
```
To verify
```shell
$ python3 --version
Python 3.8.5
```
Installing virtualenv:
```shell
$ sudo apt-get install python3-venv
$ python3 -m venv env
$ source env/bin/activate #Activate virtual environment
$ deactivate #Deactivate virtual environment
```

For React frontend, you need to have npm and node install globally on your machine. If you don't have them installed, you can follow these commands on __ubuntu__
```shell
$ cd ~
$ curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt install nodejs
```
To verify
```shell
$ node -v
12.19.0
```

__Backend Installation__

Use the package manager pip to install dependencies (preferably in a virtual environment).
Repository includes a requirements.txt for your convenience
```shell
(env) $ pip install -r requirements.txt
```
__Run__
```shell
(env) $ python3 manage.py makemigration && python3 manage.py migrate
(env) $ python3 manage.py runserver
```

__Frontend Installation__

Change directory to frontend/ebazaar and you can install dependencies by just:
```shell
$ npm install
```
__Run__
```shell
$ npm start
```
__Super User__

Since there is no superuser initially, you can create a super user using:
```shell
$ python3 manage.py createsuperuser
```
### Using Docker
If you want to avoid the hassle of going through that installation process, you can always use docker. The project makes use of two containers from [dockerhub](https://hub.docker.com/): redis and postgres and project own separate containers for both Django backend and React frontend.
```shell
$ sudo docker-compose build
```
__Run__
```shell
$ sudo docker-compose up
```
__Super User with Docker__
```shell
$ sudo docker exec -it backend python3 manage.py createsuperuser
```

## Usage

### Staff User
Staff user needs to be register and logged in to update product status. In order to get registered, /register endpoint is available on React frontend e.g. [http://localhost:3000/register](http://localhost:3000/register)

Staff user status will remain inactive until superuser makes the user active from the admin portal [http://localhost:8000/admin](http://localhost:8000/admin)


Staff user can then login once its status is active: [http://localhost:3000/login](http://localhost:3000/login)