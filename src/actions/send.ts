import { mkdir, writeFile, readFile } from 'fs/promises'
import { ChatPostMessageArguments, WebClient } from '@slack/web-api'
import { program } from 'commander'
import { homedir } from 'os'
import { HookInput } from '@/types'

program
  .command('send')
  .description('Read from stdin the hook input then send a message to Slack channel')
  .requiredOption('--channel-id <channel-id>', 'Slack Channel ID')
  .option('--mention-user-id <user-id>', 'Slack User ID to mention')
  .action(async options => {
    if (process.stdin.isTTY) {
      throw new Error('No piped input')
    }

    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) {
      chunks.push(chunk)
    }

    let threadId: string | null = null
    const hookInput: HookInput = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    const homeDir = homedir()

    try {
      threadId = await readFile(`${homeDir}/.claude-tap/sessions/${hookInput.session_id}`, 'utf8')
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }

    const postMessageParams: ChatPostMessageArguments = {
      channel: options.channelId,
      text: 'sample'
    }

    if (threadId) {
      postMessageParams.thread_ts = threadId
    } else if (options.mentionUserId) {
      postMessageParams.text = `<@${options.mentionUserId}>\n${postMessageParams.text}`
    }

    const slack = new WebClient(process.env.CLAUDE_TAP_SLACK_BOT_TOKEN)
    const result = await slack.chat.postMessage(postMessageParams)

    if (result.ts && !threadId) {
      await mkdir(`${homeDir}/.claude-tap/sessions`, { recursive: true })
      await writeFile(`${homeDir}/.claude-tap/sessions/${hookInput.session_id}`, result.ts, 'utf8')
    }
  })
