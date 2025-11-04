import { WebClient, ChatPostMessageArguments, KnownBlock } from '@slack/web-api'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { homedir } from 'os'
import { HookInput } from '@/types'

export async function getHookInputFromStdIn<HookEventName extends HookInput['hook_event_name']>(
  expectedHookEventName: HookEventName
) {
  if (process.stdin.isTTY) {
    throw new Error('No piped input')
  }

  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }

  const hookInput: HookInput = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (hookInput.hook_event_name !== expectedHookEventName) {
    throw new Error(`Hook event name should be ${expectedHookEventName}`)
  }

  return hookInput as Extract<HookInput, { hook_event_name: HookEventName }>
}

export async function sendMessage(
  hookInputSessionId: string,
  message: ChatPostMessageArguments,
  mentionUserId?: string
) {
  let threadId: string | null = null
  const homeDir = homedir()

  try {
    threadId = await readFile(`${homeDir}/.claude-tap/sessions/${hookInputSessionId}`, 'utf8')
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }

  if (!threadId) {
    if ('text' in message) {
      message.text = `Notification from a new conversation with Claude${message.text ? ` - ${message.text}` : ''}`
    }

    if ('blocks' in message && Array.isArray(message.blocks)) {
      const newBlocks: KnownBlock[] = [
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Session ID*\n\`${hookInputSessionId}\``
            }
          ]
        }
      ]

      if (mentionUserId) {
        newBlocks.unshift({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${mentionUserId}>`
          }
        })
      }

      message.blocks = [...newBlocks, ...message.blocks]
    }
  } else {
    message.thread_ts = threadId
    if ('text' in message) {
      message.text = `Work done on the current conversation with Claude${message.text ? ` - ${message.text}` : ''}`
    }
  }

  const slack = new WebClient(process.env.CLAUDE_TAP_SLACK_BOT_TOKEN)
  console.log(message)
  const result = await slack.chat.postMessage(message)

  if (result.ts && !threadId) {
    await mkdir(`${homeDir}/.claude-tap/sessions`, { recursive: true })
    await writeFile(`${homeDir}/.claude-tap/sessions/${hookInputSessionId}`, result.ts, 'utf8')
  }
}
