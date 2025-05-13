# Телеграм бот получения курса валют

Приложение телеграм бота для получения актуальных курсов валют через подключение внешних сервисов. Учебный проект MetaLamp Node.js Education.

Приложение написано на node.js с использованием typescript.

Установить зависимости: `npm install`.<br>
Переименовать `.env-default` в `.env` и задать настройки приложения и бота.<br>
Запустить приложение: `npm run dev`

## Настройки бота ##

```
APP_PORT=3000 // порт приложения
TELEGRAM_API_URL="https://api.telegram.org/bot"
TELEGRAM_TOKEN=""
TELEGRAM_USE_WEBHOOK=true // использовать веб хуки
TELEGRAM_WEBHOOK_URL="/telegram" // url к которому будет обращаться telegram http://localhost:3000/telegram
```

Бот по умолчанию работает через **веб хуки**. Также можно переключить на работу с getUpdates для этого в **.env** указать `TELEGRAM_USE_WEBHOOK=false` 

## Команды ##

* /start - начало работы с ботом
* /currency - получить список валют
* USD-RUB - формат команды получения курса валют

## Тестирование ##

### Переключить ввод/вывод на консоль ###
Для простоты проверки работы бота можно переключиться на ввод и вывод данных на консоль вместо telegram.

В *index.ts* изменить `const isUseHttpServer = false`

Запустить приложение и в консоли ввести команды.

### Postman ###

`POST http://localhost:3000/telegram`

Body: заменить CHAT_ID на свой
```
{
    "ok": true,
    "result": [
        {
            "update_id": 123,
            "message": {
                "message_id": 123,
                "from": {
                    "id": CHAT_ID,
                    "is_bot": false,
                    "first_name": "Имя",
                    "last_name": "Фамилия",
                    "username": "login",
                    "language_code": "ru"
                },
                "chat": {
                    "id": CHAT_ID,
                    "first_name": "Имя",
                    "last_name": "Фамилия",
                    "username": "login",
                    "type": "private"
                },
                "date": 1742476287,
                "text": "/currency",
                "entities": [
                    {
                        "offset": 0,
                        "length": 6,
                        "type": "bot_command"
                    }
                ]
            }
        }
    ]
}
```

### Автоматические тесты ###
Реализованы тесты для проверки корректности ввода команд пользователем, успешные и неуспешные результаты ответов, а также проблемы подключения к внешнему сервису и валидность ответов.

Запуск тестов: `npm test`
