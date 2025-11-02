import { program } from 'commander'
import '@/actions/send'

program
  .name('Claude Tap CLI')
  .description('A command line tool for claude hooks to send message to slack channel')
  .version(process.env.npm_package_version)

program.parseAsync().catch(err => console.error(err))
