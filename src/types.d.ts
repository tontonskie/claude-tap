// Base type shared by all hooks - matches Claude Code's snake_case format
type BaseHookInput = {
  session_id: string
  transcript_path: string
  cwd: string
  permission_mode: string
  hook_event_name: string
}

// Tool input/output types (these would need to be defined based on your needs)
type ToolInput = Record<string, any>
type ToolOutput = Record<string, any>

// Individual hook types
export type PreToolUseHookInput = BaseHookInput & {
  hook_event_name: 'PreToolUse'
  tool_name: string
  tool_input: ToolInput
}

export type PostToolUseHookInput = BaseHookInput & {
  hook_event_name: 'PostToolUse'
  tool_name: string
  tool_input: ToolInput
  tool_response: ToolOutput
}

export type PostCustomToolCallHookInput = BaseHookInput & {
  hook_event_name: 'PostCustomToolCall'
  tool_name: string // starts with "mcp__"
  tool_input: object
  tool_response: object
}

export type NotificationHookInput = BaseHookInput & {
  hook_event_name: 'Notification'
  message: string
  title?: string
}

export type UserPromptSubmitHookInput = BaseHookInput & {
  hook_event_name: 'UserPromptSubmit'
  prompt: string
}

export type StopHookInput = BaseHookInput & {
  hook_event_name: 'Stop'
  stop_hook_active: boolean
}

export type SubagentStopHookInput = BaseHookInput & {
  hook_event_name: 'SubagentStop'
  stop_hook_active: boolean
}

export type PreCompactHookInput = BaseHookInput & {
  hook_event_name: 'PreCompact'
  trigger: 'manual' | 'auto'
  custom_instructions: string | null
}

export type SessionStartHookInput = BaseHookInput & {
  hook_event_name: 'SessionStart'
  source: 'startup' | 'resume' | 'clear' | 'compact'
}

export type SessionEndHookInput = BaseHookInput & {
  hook_event_name: 'SessionEnd'
  reason: 'clear' | 'logout' | 'prompt_input_exit' | 'other'
}

// Complete discriminated union for all Claude Code hook inputs
export type HookInput =
  | PreToolUseHookInput
  | PostToolUseHookInput
  | PostCustomToolCallHookInput
  | NotificationHookInput
  | UserPromptSubmitHookInput
  | StopHookInput
  | SubagentStopHookInput
  | PreCompactHookInput
  | SessionStartHookInput
  | SessionEndHookInput
