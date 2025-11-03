declare namespace NodeJS {
  interface ProcessEnv {
    npm_package_name: string
    npm_package_version: string
    CLAUDE_TAP_SLACK_BOT_TOKEN: string
  }
}
