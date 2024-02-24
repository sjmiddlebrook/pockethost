import { DISCORD_ALERT_CHANNEL_URL } from '$constants'

export const discordAlert = (message: { toString: () => string }) => {
  console.error(message)
  const url = DISCORD_ALERT_CHANNEL_URL()
  console.log({ url })
  if (!url) return
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content: message.toString(),
    }),
    headers: { 'Content-Type': 'application/json' },
  }).catch(console.error)
}
