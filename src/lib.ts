import { WebClient, ChatPostMessageArguments } from '@slack/web-api'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { homedir } from 'os'
import { BaseHookInput } from '@/types'

export async function getHookInputFromStdIn<T extends BaseHookInput>(): Promise<T> {
  if (process.stdin.isTTY) {
    throw new Error('No piped input')
  }

  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
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

  if (threadId) {
    message.thread_ts = threadId
  } else if (mentionUserId && 'text' in message) {
    message.text = `<@${mentionUserId}>\n${message.text}`
  }

  const slack = new WebClient(process.env.CLAUDE_TAP_SLACK_BOT_TOKEN)
  console.log(message)
  const result = await slack.chat.postMessage(message)

  if (result.ts && !threadId) {
    await mkdir(`${homeDir}/.claude-tap/sessions`, { recursive: true })
    await writeFile(`${homeDir}/.claude-tap/sessions/${hookInputSessionId}`, result.ts, 'utf8')
  }
}
