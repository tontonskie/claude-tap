import { ChatPostMessageArguments } from '@slack/web-api'
import { StopHookInput } from '@/types'
import { getHookInputFromStdIn, sendMessage } from '@/lib'
import { cli } from '@/cli'

cli
  .command('send-stop')
  .description('Send message derived from stop hook event')
  .action(async (options, command) => {
    const opts = command.optsWithGlobals()
    const hookInput: StopHookInput = await getHookInputFromStdIn()

    const message: ChatPostMessageArguments = {
      channel: opts.channelId,
      text: 'Stop Hook'
    }

    await sendMessage(hookInput.session_id, message, opts.mentionUserId)
  })
