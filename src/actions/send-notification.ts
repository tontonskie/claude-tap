import { ChatPostMessageArguments } from '@slack/web-api'
import { getHookInputFromStdIn, sendMessage } from '@/lib'
import { cli } from '@/cli'

cli
  .command('send-notification')
  .description('Send message derived from notification hook event')
  .action(async (options, command) => {
    const opts = command.optsWithGlobals()
    const hookInput = await getHookInputFromStdIn('Notification')

    const message: ChatPostMessageArguments = {
      channel: opts.channelId,
      text: ':hourglass_flowing_sand: Awaiting user input...',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              `:hourglass_flowing_sand: *Awaiting your input...*\n\n` +
              `Please provide the required information to proceed.`
          }
        }
      ]
    }

    await sendMessage(hookInput.session_id, message, opts.mentionUserId)
  })
