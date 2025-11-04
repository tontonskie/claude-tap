import { Command } from '@commander-js/extra-typings'
import { config } from 'dotenv'

config({ quiet: true })

if (!process.env.CLAUDE_TAP_SLACK_BOT_TOKEN) {
  throw new Error('No Slack Bot token provided.')
}

export const cli = new Command()
  .requiredOption('--channel-id <channel-id>', 'Slack Channel ID')
  .option('--mention-user-id <user-id>', 'Slack User ID to mention')

cli.name('Claude Tap CLI')
cli.version(process.env.npm_package_version)
cli.description('A command line tool for claude hooks to send message to slack channel')
