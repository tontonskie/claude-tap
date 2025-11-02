import { ClaudeTap } from '@/lib'
import { program } from 'commander'

program
  .command('send')
  .description('Read from stdin the hook input then send a message to Slack channel')
  .action(async () => {
    const claudeTap = await ClaudeTap.fromStdIn(process.env.CLAUDE_TAP_SLACK_WEBHOOK_URL!)
    console.log(claudeTap)
  })
