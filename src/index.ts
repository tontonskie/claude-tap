import { cli } from '@/cli'
import '@/actions/send-stop'

cli.parseAsync().catch(err => console.error(err))
