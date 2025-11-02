import { IncomingWebhook } from '@slack/webhook'

export class ClaudeTap {
  private readonly slack: IncomingWebhook

  constructor(slackWebhookUrl: string) {
    this.slack = new IncomingWebhook(slackWebhookUrl)
  }

  static async fromStdIn(slackWebhookUrl: string) {
    return new ClaudeTap(slackWebhookUrl)
  }
}
