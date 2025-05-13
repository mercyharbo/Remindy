# Holiday Reminder Bot

A Node.js backend app that sends you Telegram reminders for upcoming public holidays in the US, UK, and Nigeria (Africa) using the Google Calendar API. Reminders are sent 1-2 days before each holiday.

## Features

- Fetches public holidays from Google Calendar for US, UK, and Nigeria
- Schedules Telegram reminders 1-2 days before each holiday
- Daily refresh to catch new or updated holidays
- Test endpoint to verify Telegram delivery

## Requirements

- Node.js (v14 or higher recommended)
- A Telegram bot token ([create one with BotFather](https://core.telegram.org/bots#botfather))
- Your Telegram chat ID (see below)
- Google Calendar API key ([get one here](https://console.developers.google.com/))

## Setup

1. **Clone the repository**

```sh
# Example:
git clone https://github.com/yourusername/holiday-reminder.git
cd holiday-reminder
```

2. **Install dependencies**

```sh
npm install
```

3. **Configure environment variables**

Create a `.env` file in the project root:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_telegram_chat_id
GOOGLE_API_KEY=your_google_calendar_api_key
```

- To get your `CHAT_ID`, start a chat with your bot on Telegram, then use [@userinfobot](https://t.me/userinfobot) to get your user ID.

4. **Run the app**

```sh
node index.js
```

The server will start on port 3000 by default.

## Usage

- The app will automatically fetch holidays and schedule reminders at startup and every midnight.
- To test Telegram delivery, visit:
  - `http://localhost:3000/test-reminder`
  - You should receive a test message in 1 minute.

## Deployment

- Set your environment variables in your hosting provider's dashboard (do not upload `.env` to git).
- Use a web service or background worker to keep the app running.
- The app will refresh reminders every day at midnight (server time).

## Customization

- To change countries, update the `CALENDAR_IDS` object in `index.js`.
- To adjust reminder timing, modify the `[1, 2]` array in the scheduling logic.

## License

MIT
