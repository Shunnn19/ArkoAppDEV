FROM php:8.1-apache

RUN a2enmod rewrite headers
RUN docker-php-ext-install pdo pdo_mysql

COPY dist/ /var/www/html/
COPY backend/ /var/www/html/api/

RUN chown -R www-data:www-data /var/www/html
