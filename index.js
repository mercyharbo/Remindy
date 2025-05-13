require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const schedule = require('node-schedule')
const { Telegraf } = require('telegraf')

const app = express()
const PORT = process.env.PORT || 3000

// TODO: Replace with your Telegram Bot Token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.CHAT_ID // Replace with your chat ID
const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

// Google Calendar API public holiday calendar IDs
const CALENDAR_IDS = {
  US: 'en.usa#holiday@group.v.calendar.google.com',
  UK: 'en.uk#holiday@group.v.calendar.google.com',
  Africa: 'en.ng#holiday@group.v.calendar.google.com', // Nigeria as Africa region
}

// Fetch holidays from Google Calendar API
async function fetchHolidays(calendarId) {
  const now = new Date().toISOString()
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${process.env.GOOGLE_API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime`
  const res = await fetch(url)
  const data = await res.json()
  return data.items || []
}

// Schedule reminders for holidays
async function scheduleReminders() {
  for (const [country, calendarId] of Object.entries(CALENDAR_IDS)) {
    const holidays = await fetchHolidays(calendarId)
    holidays.forEach((event) => {
      const holidayDate = new Date(event.start.date)
      ;[1, 2].forEach((daysBefore) => {
        const reminderDate = new Date(holidayDate)
        reminderDate.setDate(reminderDate.getDate() - daysBefore)
        if (reminderDate > new Date()) {
          schedule.scheduleJob(reminderDate, () => {
            bot.telegram.sendMessage(
              CHAT_ID,
              `Reminder: ${event.summary} (${country}) is in ${daysBefore} day(s) on ${event.start.date}`
            )
          })
        }
      })
    })
  }
}

app.get('/', (req, res) => {
  res.send('Holiday Reminder Bot is running.')
})

// Test endpoint to send a dummy reminder in 1 minute
app.get('/test-reminder', (req, res) => {
  const testTime = new Date(Date.now() + 60 * 1000) // 1 minute from now
  schedule.scheduleJob(testTime, () => {
    bot.telegram.sendMessage(
      CHAT_ID,
      'This is a test reminder from your Holiday Reminder Bot!'
    )
  })
  res.send('Test reminder scheduled for 1 minute from now.')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  scheduleReminders()
  // Schedule to refresh reminders every day at midnight
  schedule.scheduleJob('0 0 * * *', () => {
    console.log('Refreshing holiday reminders...')
    scheduleReminders()
  })
})
