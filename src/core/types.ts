import type { ToolName, ToolResult } from './tools';

export type MessageStatus = 'final' | 'streaming' | 'aborted' | 'error';
export type MessageRole = 'user' | 'assistant' | 'system';
export type LlmMessageRole = 'user' | 'assistant';
export type LlmMessage = { role: LlmMessageRole; content: string };

export type Conversation = {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
};

export type Message = {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    status: MessageStatus;
    createdAt: number;
    updatedAt: number;
};

export type ConversationSummary = {
    id: string;
    title: string;
    updatedAt: number;
    messageCount: number;
};

export type ConversationWithMessages = {
    conversation: Conversation;
    messages: Message[];
};

export type Dimension = number | 'auto' | `${number}%`;

export type TextDeltaEvent = {
    type: 'text_delta';
    text: string;
};

export type TextEndEvent = {
    type: 'text_end';
    fullText: string;
};

export type ToolUseEvent = {
    type: 'tool_use';
    toolUseId: string;
    toolName: ToolName;
    input: unknown;
    status: 'running' | 'completed' | 'error';
    result?: ToolResult;
    timestamp: number;
};

export type StreamEvent = TextDeltaEvent | TextEndEvent | ToolUseEvent;
