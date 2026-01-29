import type { Model } from '@anthropic-ai/sdk/resources';
import type { LlmMessage } from '../types';
import { Anthropic } from '@anthropic-ai/sdk';
import { env } from '../../config/env';

const client = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY
});

const MODEL: Model = 'claude-haiku-4-5';
const MAX_TOKENS = 8192;
const SYSTEM_PROMPT = `You are Kratt, an AI coding assistant. You help users with software development tasks.
Be concise and helpful. When showing code, use markdown code blocks with language identifiers.`;

export async function* streamChat(messages: LlmMessage[]): AsyncGenerator<string> {
    const stream = client.messages.stream({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({
            role: m.role,
            content: m.content
        }))
    });

    for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            yield event.delta.text;
        }
    }
}
