import type { ContentBlock, MessageParam, Model, TextBlock, ToolResultBlockParam, ToolUseBlock } from '@anthropic-ai/sdk/resources';
import type { LlmMessage, StreamEvent } from '../types';
import type { ToolName } from '../tools';
import { tools, executeTool } from '../tools';
import { Anthropic } from '@anthropic-ai/sdk';
import { env } from '../../config/env';

const client = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY
});

const MODEL: Model = 'claude-haiku-4-5';
const MAX_TOKENS = 8192;
const SYSTEM_PROMPT = `You are Kratt, an AI coding assistant. You help users with software development tasks.
Be concise and helpful. When showing code, use markdown code blocks with language identifiers.

You have access to tools that allow you to:
- List directory contents to understand project structure
- Read files to understand existing code
- Edit files to make changes

When asked to make code changes:
1. First use list_directory to understand the project structure if needed
2. Use read_file to see the current content of files you need to modify
3. Use edit_file to make precise changes

Always explain what changes you're making and why.`;

export async function* streamChat(messages: LlmMessage[]): AsyncGenerator<StreamEvent> {
    let conversationMessages: MessageParam[] = messages.map((m) => ({
        role: m.role,
        content: m.content
    }));

    let continueLoop = true;

    let fullText = '';

    while (continueLoop) {
        const stream = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            tools: tools,
            messages: conversationMessages
        });

        const toolUseBlocks: Array<{ id: string; name: string; inputJson: string }> = [];
        let stopReason: string | null = null;

        for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                fullText += event.delta.text;
                yield { type: 'text_delta', text: event.delta.text };
            } else if (event.type === 'content_block_start' && event.content_block.type === 'tool_use') {
                toolUseBlocks.push({
                    id: event.content_block.id,
                    name: event.content_block.name,
                    inputJson: ''
                });
            } else if (event.type === 'content_block_delta' && event.delta.type === 'input_json_delta') {
                const lastBlock = toolUseBlocks[toolUseBlocks.length - 1];
                if (lastBlock) {
                    lastBlock.inputJson += event.delta.partial_json;
                }
            } else if (event.type === 'message_delta') {
                stopReason = event.delta.stop_reason;
            }
        }

        if (stopReason === 'tool_use' && toolUseBlocks.length > 0) {
            const textBeforeTools = fullText;
            if (textBeforeTools) {
                yield { type: 'text_end', fullText: textBeforeTools };
                fullText = '';
            }

            const assistantContent: ContentBlock[] = [];

            if (textBeforeTools) {
                assistantContent.push({ type: 'text', text: textBeforeTools } as TextBlock);
            }

            for (const block of toolUseBlocks) {
                const parsedInput = JSON.parse(block.inputJson || '{}');

                assistantContent.push({
                    type: 'tool_use',
                    id: block.id,
                    name: block.name,
                    input: parsedInput
                } as ToolUseBlock);
            }

            conversationMessages.push({
                role: 'assistant',
                content: assistantContent
            });

            const toolResults: ToolResultBlockParam[] = [];

            for (const block of toolUseBlocks) {
                const parsedInput = JSON.parse(block.inputJson || '{}');

                yield {
                    type: 'tool_use',
                    toolUseId: block.id,
                    toolName: block.name as ToolName,
                    input: parsedInput,
                    status: 'running',
                    timestamp: Date.now()
                };

                const result = await executeTool(block.name as ToolName, parsedInput);

                yield {
                    type: 'tool_use',
                    toolUseId: block.id,
                    toolName: block.name as ToolName,
                    input: parsedInput,
                    status: 'completed',
                    result,
                    timestamp: Date.now()
                };

                toolResults.push({
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: result.success ? result.output : `Error: ${result.error}`,
                    is_error: !result.success
                });
            }

            conversationMessages.push({
                role: 'user',
                content: toolResults
            });
        } else {
            if (fullText) {
                yield { type: 'text_end', fullText };
            }
            continueLoop = false;
        }
    }
}
