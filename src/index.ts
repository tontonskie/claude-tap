#!/usr/bin/env node

import { cli } from '@/cli'
import '@/actions/send-notification'
import '@/actions/send-stop'

cli.parseAsync().catch(err => console.error(err))
