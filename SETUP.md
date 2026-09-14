# Superbot — деплой, Mini App и заявки в Telegram

## Что уже есть в проекте

- Фронтенд (React + Vite) — деплой на Vercel
- `POST /api/send-lead` — отправка заявок в Telegram
- `GET /api/rates` — курсы из Google Sheets

Секреты **не хранятся в GitHub** — только в `.env` локально и в **Environment Variables** на Vercel.

---

## 1. Обновить GitHub (новые изменения)

На своём Mac в папке проекта:

```bash
cd /Users/maxsvirski/Work/superbot

git status          # что изменилось
git add .           # добавить все файлы ( .env не попадёт — он в .gitignore )
git commit -m "Описание изменений"
git push origin main
```

Если `git status` пишет *nothing to commit* и *up to date with origin/main* — на GitHub **уже лежит** текущая версия кода, пушить нечего.

**Vercel:** если репозиторий подключён к проекту, после `git push` деплой обычно стартует сам (1–3 минуты). Проверка: Vercel → Project → Deployments.

**Что мне (или другому разработчику) отправлять:** ссылку на репозиторий `https://github.com/MaxbIch/superbot` — **не** присылайте токен бота и `.env`.

---

## 2. Переменные на Vercel

Vercel → ваш проект → **Settings → Environment Variables**

| Переменная | Пример | Где |
|------------|--------|-----|
| `TELEGRAM_BOT_TOKEN` | от @BotFather | Production + Preview |
| `TELEGRAM_ADMIN_CHAT_ID` | ID группы или лички (см. ниже) | Production + Preview |
| `VITE_TELEGRAM_BOT_USERNAME` | `nha_trang_superbot` **без @** | Production + Preview |

После изменения переменных: **Deployments → … → Redeploy** (для `VITE_*` обязательно пересобрать).

Локально:

```bash
cp .env.example .env
# заполните .env и перезапустите npm run dev
```

---

## 3. Заявки в группу с админами

Код уже шлёт все заявки на `TELEGRAM_ADMIN_CHAT_ID` — подойдёт **и личный чат, и группа**.

### Создать группу

1. Telegram → **Новая группа** (например «Superbot — заявки»).
2. Добавьте **бота** (@nha_trang_superbot) в группу.
3. Сделайте бота **администратором** с правом **отправлять сообщения** (остальное по желанию).

### Узнать ID группы

1. Напишите в группе любое сообщение (например `test`).
2. В браузере (подставьте свой токен):

   ```
   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates
   ```

3. Найдите блок `"chat":{"id":-1001234567890,...}` — это **ID группы** (часто начинается с `-100`).

4. Вставьте его в Vercel и локальный `.env`:

   ```env
   TELEGRAM_ADMIN_CHAT_ID=-1001234567890
   ```

5. Redeploy на Vercel.

### Проверка

Откройте сайт / Mini App → любая форма → **Отправить заявку**. Сообщение должно появиться **в группе**.

**Типичные ошибки**

| Ошибка | Решение |
|--------|---------|
| Chat not found | Неверный ID; бот не в группе |
| Bot was kicked / not a member | Снова добавьте бота |
| Have no rights to send | Выдайте боту право писать в группе |

---

## 4. Mini App в Telegram (ваше приложение внутри Telegram)

Приложение **не крутится на вашем компьютере** — оно открывается по URL с Vercel. Vercel держит сайт и API **постоянно доступными** (serverless + CDN). «Всегда запущено» = задеплоено на Vercel с рабочими env.

### Шаг A — URL продакшена

1. Vercel → Project → **Domains** — скопируйте URL, например `https://superbot-xxx.vercel.app`.
2. Откройте в браузере: должна открыться главная, формы работать.

### Шаг B — Mini App в BotFather

1. [@BotFather](https://t.me/BotFather) → `/mybots` → ваш бот.
2. **Bot Settings → Menu Button → Configure**  
   - Тип: **Web App**  
   - URL: `https://ваш-домен.vercel.app` (без слэша в конце или как принимает BotFather)
3. Либо создайте приложение: `/newapp` → выберите бота → укажите тот же URL.

Пользователь открывает бота → кнопка **Menu** (или ссылка вида `https://t.me/nha_trang_superbot/app`) → внутри Telegram грузится ваш сайт.

### Шаг C — проверка заявок из Mini App

В Mini App Telegram передаёт данные пользователя — в заявке в группе будут имя, @username и ID (если пользователь не скрыл username).

---

## 5. Бот (кратко)

1. @BotFather → `/newbot` → токен → `TELEGRAM_BOT_TOKEN`.
2. Группа + ID → `TELEGRAM_ADMIN_CHAT_ID`.
3. Username без `@` → `VITE_TELEGRAM_BOT_USERNAME`.
4. Vercel env + redeploy.
5. Menu Button / `/newapp` → URL Vercel.

---

## 6. Категории заявок

| Раздел | category |
|--------|----------|
| Аренда байка | `transport/bike` |
| Аренда авто | `transport/car` |
| Жильё | `housing` |
| Визараны | `visarun` |
| Туры | `tours` |
| Обмен валют | `currency` |

---

## 7. Локальная разработка

```bash
npm install
npm run dev
```

http://localhost:5173/ — API `/api/send-lead` и `/api/rates` работают через Vite (нужен заполненный `.env`).
