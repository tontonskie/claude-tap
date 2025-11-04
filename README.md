# Claude Tap

A command-line tool that integrates with [Claude Code](https://claude.ai/code) hooks to send notifications to Slack channels. Get real-time updates about your Claude Code sessions directly in Slack.

## Features

- Send notifications to Slack when Claude Code requires user input
- Get completion notifications when Claude finishes working on a request
- Optional user mentions for important notifications
- Session tracking across conversations

## Prerequisites

- Node.js >= 22
- A Slack workspace with admin access
- [Claude Code](https://docs.claude.com/en/docs/claude-code) installed

## Installation

Install globally via npm:

```bash
npm install -g claude-tap
```

## Slack Setup

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Claude Tap") and select your workspace

### 2. Configure Bot Permissions

1. Navigate to "OAuth & Permissions" in the sidebar
2. Under "Scopes" → "Bot Token Scopes", add these scopes:
   - **`chat:write`** (required) - Post messages to channels the bot has joined
   - **`chat:write.public`** (recommended) - Post messages to public channels without joining them first

**Why both scopes?**
- `chat:write` alone requires you to invite the bot to each channel: `/invite @YourBotName`
- `chat:write.public` lets the bot post to any public channel without being a member
- For private channels, you must always invite the bot first

### 3. Install App to Workspace

1. Click "Install to Workspace" at the top of the OAuth & Permissions page
2. Authorize the app
3. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 4. Get Your Channel ID

1. Open Slack in your browser or desktop app
2. Navigate to the channel where you want notifications
3. Click the channel name at the top
4. Scroll down in the "About" section to find the Channel ID
5. Copy the Channel ID (e.g., `C1234567890`)

### 5. (Optional) Get Your User ID

To receive @mentions in notifications:

1. Click your profile picture in Slack
2. Select "Profile" → "More" (three dots) → "Copy member ID"
3. Save the User ID (e.g., `U1234567890`)

## Configuration

### Option 1: Environment Variable

Set your Slack Bot Token as an environment variable:

```bash
export CLAUDE_TAP_SLACK_BOT_TOKEN="xoxb-your-token-here"
```

To make this permanent, add it to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
echo 'export CLAUDE_TAP_SLACK_BOT_TOKEN="xoxb-your-token-here"' >> ~/.zshrc
source ~/.zshrc
```

### Option 2: .env File

Create a `.env` file in your project root:

```bash
CLAUDE_TAP_SLACK_BOT_TOKEN=xoxb-your-token-here
```

Claude Tap will automatically load the token from the `.env` file when running in that directory.

## Usage with Claude Code Hooks

Claude Tap is designed to be used with [Claude Code hooks](https://docs.claude.com/en/docs/claude-code/hooks).

### Example Hook Configuration

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "claude-tap --channel-id C1234567890 --mention-user-id U1234567890 send-notification"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "claude-tap --channel-id C1234567890 send-stop"
          }
        ]
      }
    ]
  }
}
```

**Replace:**
- `C1234567890` with your Slack channel ID
- `U1234567890` with your Slack user ID (or omit `--mention-user-id` flag entirely)

For more information about configuring hooks, see the [Claude Code hooks documentation](https://docs.claude.com/en/docs/claude-code/hooks).

## CLI Reference

### Global Options

- `--channel-id <channel-id>` (required) - The Slack channel ID to send messages to
- `--mention-user-id <user-id>` (optional) - Slack user ID to @mention in notifications

### Commands

- `send-notification` - Send notification when Claude needs input (use with Notification hook)
- `send-stop` - Send completion message when Claude finishes (use with Stop hook)

## Troubleshooting

### "No Slack Bot token provided" error

Make sure the `CLAUDE_TAP_SLACK_BOT_TOKEN` environment variable is set:

```bash
echo $CLAUDE_TAP_SLACK_BOT_TOKEN
```

If empty, set it using one of the [Configuration](#configuration) methods above.

### Messages not appearing in Slack

1. **Verify bot permissions:**
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Select your app → "OAuth & Permissions"
   - Confirm `chat:write` scope is added
   - For public channels without inviting the bot, add `chat:write.public`

2. **Check channel ID is correct** - Channel IDs start with 'C' (e.g., C1234567890)

3. **For private channels, invite the bot:**
   ```
   /invite @YourBotName
   ```

4. **Verify token format** - Bot tokens must start with `xoxb-`

### "No piped input" error

This tool requires JSON input via stdin from Claude Code hooks. It cannot be run directly from the command line.

### Hook not executing

See the [Claude Code hooks documentation](https://docs.claude.com/en/docs/claude-code/hooks) for troubleshooting hook issues.

## License

ISC

## Repository

[github.com/tontonskie/claude-tap](https://github.com/tontonskie/claude-tap)

## Author

Anthony De Leon (tontondeleon03@gmail.com)
