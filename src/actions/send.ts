import { program } from 'commander'

program
  .command('send')
  .description('Read from stdin the hook input then send a message to Slack channel')
  .action(async () => {})
