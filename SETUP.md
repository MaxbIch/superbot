# Настройка Telegram-бота для Superbot

Это руководство поможет создать бота, подключить его к проекту и начать получать заявки.

## 1. Создайте бота в Telegram

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Введите **имя** бота (например: `Супер бот Нячанга`)
4. Введите **username** бота (например: `nha_trang_superbot`) — должен заканчиваться на `bot`
5. BotFather пришлёт **токен** вида `123456789:ABCdefGHIjklMNOpqrsTUVwxyz` — сохраните его

## 2. Узнайте свой Chat ID (админ)

Бот будет отправлять заявки на ваш личный Telegram.

**Способ 1 — через @userinfobot:**
1. Откройте [@userinfobot](https://t.me/userinfobot)
2. Нажмите Start
3. Скопируйте ваш **Id** (число, например `987654321`)

**Способ 2 — через API:**
1. Напишите вашему новому боту любое сообщение (например «Привет»)
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   ```
3. Найдите `"chat":{"id":987654321}` — это ваш Chat ID

## 3. Настройте переменные окружения

Скопируйте пример и заполните значения:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=987654321
VITE_TELEGRAM_BOT_USERNAME=nha_trang_superbot
```

| Переменная | Описание |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен от BotFather (секретный, только на сервере) |
| `TELEGRAM_ADMIN_CHAT_ID` | Ваш Telegram ID — сюда приходят заявки |
| `VITE_TELEGRAM_BOT_USERNAME` | Username бота без `@` — для кнопок «Связаться» |

## 4. Запуск локально

```bash
npm install
npm run dev
```

Откройте http://localhost:5173/

API `/api/send-lead` работает локально через Vite middleware — заявки будут уходить в Telegram, если `.env` заполнен.

## 5. Создайте Mini App (опционально)

Чтобы открывать приложение прямо в Telegram:

1. Задеплойте проект на [Vercel](https://vercel.com) (см. шаг 6)
2. В [@BotFather](https://t.me/BotFather) отправьте `/newapp`
3. Выберите вашего бота
4. Укажите название, описание и загрузите иконку
5. Укажите URL вашего приложения (например `https://superbot.vercel.app`)
6. BotFather создаст ссылку вида `https://t.me/your_bot/app`

Также можно настроить Menu Button:
```
/mybots → выберите бота → Bot Settings → Menu Button → Configure
```

## 6. Деплой на Vercel

1. Загрузите проект на GitHub
2. Импортируйте репозиторий в [Vercel](https://vercel.com)
3. В **Settings → Environment Variables** добавьте:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_ADMIN_CHAT_ID`
   - `VITE_TELEGRAM_BOT_USERNAME`
4. Нажмите Deploy

API-роуты в папке `api/` автоматически станут serverless-функциями:
- `POST /api/send-lead` — отправка заявок админу
- `GET /api/rates` — курсы валют из Google Sheets

## 7. Проверка

1. Откройте приложение
2. Перейдите в любой раздел с формой (Жильё, Визараны, Транспорт)
3. Заполните все поля и нажмите **«Отправить заявку»**
4. В Telegram должно прийти сообщение с данными заявки и информацией о клиенте (если открыто через Mini App)

## Куда отправляются заявки

| Раздел | Категория |
|---|---|
| Аренда байка | `transport/bike` |
| Аренда авто | `transport/car` |
| Жильё | `housing` |
| Визараны | `visarun` |
| Туры | `tours` |
| Обмен валют | `currency` |

## Устранение проблем

**«Telegram bot is not configured»**
→ Проверьте, что `.env` содержит `TELEGRAM_BOT_TOKEN` и `TELEGRAM_ADMIN_CHAT_ID`, и перезапустите `npm run dev`

**Заявки не приходят**
→ Убедитесь, что вы написали боту хотя бы одно сообщение (Telegram не даёт боту писать первым незнакомым пользователям — но админ может получать, если ранее писал боту)

**403 Forbidden от Telegram API**
→ Проверьте правильность токена

**Chat not found**
→ Проверьте Chat ID; напишите боту `/start` и повторите getUpdates
