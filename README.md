# Тестовое задание bothub

## Исполнитель [Мельник Руслан Сергеевич](https://surgut.hh.ru/resume/f983c45cff0bee08e50039ed1f723673737344)

## Запуск
Для работы необходим .env файл, запущенная база данных, а также скрипты для запуска 

run.sh
```bash
#!/bin/bash
export DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/development
echo "Using DATABASE_URL: $DATABASE_URL"
yarn dev
```
test.sh
```bash
#!/bin/bash
export DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/test_db
echo "Using DATABASE_URL: $DATABASE_URL"
yarn test:reset
```