const { IncomingWebhook } = require('@slack/webhook');

export default class SlackAPI {
  /**
   * This class sends a message to a Slack Channel. How to get the WebHook Slack URL:
   * https://slack.com/intl/en-br/help/articles/115005265063-Incoming-webhooks-for-Slack
   */
  send(payload: any, webhookUrl: string): Promise<void> {
    const slackWebHook = new IncomingWebhook(webhookUrl);
    
    if (typeof payload === 'string') {
      payload = { text: payload }
    }

    return slackWebHook.send(payload);
  }
}
