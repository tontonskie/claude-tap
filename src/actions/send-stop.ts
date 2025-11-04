import { ChatPostMessageArguments } from '@slack/web-api'
import { getHookInputFromStdIn, sendMessage } from '@/lib'
import { cli } from '@/cli'

cli
  .command('send-stop')
  .description('Send message derived from stop hook event')
  .action(async (options, command) => {
    const opts = command.optsWithGlobals()
    const hookInput = await getHookInputFromStdIn('Stop')

    const message: ChatPostMessageArguments = {
      channel: opts.channelId,
      text: 'Finished working on request',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: ':white_check_mark: Finished working on request'
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              `Completed at <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}` +
              `|${new Date().toISOString()}>`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: ':sparkles: Request completed successfully'
            }
          ]
        }
      ]
    }

    await sendMessage(hookInput.session_id, message, opts.mentionUserId)
  })
