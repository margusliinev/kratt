import type Anthropic from '@anthropic-ai/sdk';

export const tools: Anthropic.Tool[] = [
    {
        name: 'list_directory',
        description: `List the contents of a directory in the project. Returns file and folder names with their types.
Use this tool to understand the project structure before reading or editing files.
The path should be relative to the project root or an absolute path.`,
        input_schema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to the directory to list. Use "." for the current project root.'
                },
                recursive: {
                    type: 'boolean',
                    description: 'If true, list contents recursively (default: false). Use with caution on large directories.'
                },
                max_depth: {
                    type: 'number',
                    description: 'Maximum depth for recursive listing (default: 3). Only used when recursive is true.'
                }
            },
            required: ['path']
        }
    },
    {
        name: 'read_file',
        description: `Read the contents of a file. Returns the file content as text.
Use this tool to understand existing code before making edits.
The path should be relative to the project root or an absolute path.`,
        input_schema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to the file to read.'
                },
                start_line: {
                    type: 'number',
                    description: 'Optional: The line number to start reading from (1-based). If not provided, reads from the beginning.'
                },
                end_line: {
                    type: 'number',
                    description: 'Optional: The line number to stop reading at (1-based, inclusive). If not provided, reads to the end.'
                }
            },
            required: ['path']
        }
    },
    {
        name: 'edit_file',
        description: `Edit a file by replacing specific text content. This tool performs a precise search-and-replace operation.
To use this tool effectively:
1. First use read_file to see the current content
2. Provide the EXACT text to replace (including whitespace and indentation)
3. Provide the new text that should replace it

The old_text must match exactly - include enough context (3-5 lines before and after) to make the match unique.
If the file doesn't exist, it will be created with the new_text content.`,
        input_schema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to the file to edit.'
                },
                old_text: {
                    type: 'string',
                    description:
                        'The exact text to find and replace. Must match exactly including whitespace. For new files, leave empty or omit.'
                },
                new_text: {
                    type: 'string',
                    description: 'The new text to replace the old text with. For deletions, use empty string.'
                }
            },
            required: ['path', 'new_text']
        }
    }
];

export type ListDirectoryInput = {
    path: string;
    recursive?: boolean;
    max_depth?: number;
};

export type ReadFileInput = {
    path: string;
    start_line?: number;
    end_line?: number;
};

export type EditFileInput = {
    path: string;
    old_text?: string;
    new_text: string;
};

export type ToolInput = ListDirectoryInput | ReadFileInput | EditFileInput;

export type ToolName = 'list_directory' | 'read_file' | 'edit_file';
