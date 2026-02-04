import type { EditFileInput, ListDirectoryInput, ReadFileInput, ToolName } from './definitions';
import { basename, join, relative, resolve } from 'path';
import { readdir, stat } from 'node:fs/promises';

const PROJECT_ROOT = process.cwd();

export type ToolResult = {
    success: boolean;
    output: string;
    error?: string;
};

type DirectoryEntry = {
    name: string;
    type: 'file' | 'directory';
    path: string;
};

function resolvePath(inputPath: string): string {
    const resolved = resolve(PROJECT_ROOT, inputPath);
    if (!resolved.startsWith(PROJECT_ROOT)) {
        throw new Error(`Access denied: Path "${inputPath}" is outside the project directory`);
    }
    return resolved;
}

async function listDirectoryRecursive(dirPath: string, currentDepth: number, maxDepth: number, entries: DirectoryEntry[]): Promise<void> {
    if (currentDepth > maxDepth) return;

    try {
        const items = await readdir(dirPath);

        for (const item of items.sort()) {
            if (item.startsWith('.')) continue;

            const fullPath = join(dirPath, item);
            const relativePath = relative(PROJECT_ROOT, fullPath);

            try {
                const stats = await stat(fullPath);

                if (stats.isDirectory()) {
                    entries.push({
                        name: basename(item),
                        type: 'directory',
                        path: relativePath
                    });

                    if (currentDepth < maxDepth) {
                        await listDirectoryRecursive(fullPath, currentDepth + 1, maxDepth, entries);
                    }
                } else if (stats.isFile()) {
                    entries.push({
                        name: basename(item),
                        type: 'file',
                        path: relativePath
                    });
                }
            } catch (error) {
                throw new Error(`Failed to stat path "${relativePath}": ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    } catch (error) {
        throw new Error(`Failed to list directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function executeListDirectory(input: ListDirectoryInput): Promise<ToolResult> {
    try {
        const dirPath = resolvePath(input.path);
        const recursive = input.recursive ?? false;
        const maxDepth = input.max_depth ?? 3;

        const entries: DirectoryEntry[] = [];
        const items = await readdir(dirPath);

        for (const item of items.sort()) {
            if (item.startsWith('.')) continue;

            const fullPath = join(dirPath, item);
            const relativePath = relative(PROJECT_ROOT, fullPath);

            try {
                const stats = await stat(fullPath);

                if (stats.isDirectory()) {
                    entries.push({
                        name: basename(item),
                        type: 'directory',
                        path: relativePath
                    });

                    if (recursive) {
                        await listDirectoryRecursive(fullPath, 1, maxDepth, entries);
                    }
                } else if (stats.isFile()) {
                    entries.push({
                        name: basename(item),
                        type: 'file',
                        path: relativePath
                    });
                }
            } catch (error) {
                throw new Error(`Failed to stat path "${relativePath}": ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        const output =
            entries.length === 0
                ? 'Directory is empty.'
                : entries.map((e) => `${e.type === 'directory' ? '📁' : '📄'} ${e.path}`).join('\n');

        return {
            success: true,
            output: `Contents of ${relative(PROJECT_ROOT, dirPath) || '.'}:\n\n${output}`
        };
    } catch (error) {
        return {
            success: false,
            output: '',
            error: error instanceof Error ? error.message : 'Unknown error listing directory'
        };
    }
}

export async function executeReadFile(input: ReadFileInput): Promise<ToolResult> {
    try {
        const filePath = resolvePath(input.path);
        const file = Bun.file(filePath);

        if (!(await file.exists())) {
            return {
                success: false,
                output: '',
                error: `File not found: ${input.path}`
            };
        }

        const content = await file.text();
        const lines = content.split('\n');

        const startLine = input.start_line ? Math.max(1, input.start_line) : 1;
        const endLine = input.end_line ? Math.min(lines.length, input.end_line) : lines.length;

        if (startLine > lines.length) {
            return {
                success: false,
                output: '',
                error: `Start line ${startLine} exceeds file length (${lines.length} lines)`
            };
        }

        const selectedLines = lines.slice(startLine - 1, endLine);
        const numberedContent = selectedLines.map((line, index) => `${String(startLine + index).padStart(4, ' ')} | ${line}`).join('\n');

        const lineInfo =
            input.start_line || input.end_line ? ` (lines ${startLine}-${endLine} of ${lines.length})` : ` (${lines.length} lines)`;

        return {
            success: true,
            output: `File: ${relative(PROJECT_ROOT, filePath)}${lineInfo}\n\n${numberedContent}`
        };
    } catch (error) {
        return {
            success: false,
            output: '',
            error: error instanceof Error ? error.message : 'Unknown error reading file'
        };
    }
}

export async function executeEditFile(input: EditFileInput): Promise<ToolResult> {
    try {
        const filePath = resolvePath(input.path);
        const file = Bun.file(filePath);
        const fileExists = await file.exists();

        if (!input.old_text || input.old_text === '') {
            await Bun.write(filePath, input.new_text);

            return {
                success: true,
                output: fileExists
                    ? `File overwritten: ${relative(PROJECT_ROOT, filePath)}`
                    : `File created: ${relative(PROJECT_ROOT, filePath)}`
            };
        }

        if (!fileExists) {
            return {
                success: false,
                output: '',
                error: `File not found: ${input.path}. To create a new file, omit old_text.`
            };
        }

        const content = await file.text();

        if (!content.includes(input.old_text)) {
            const lines = input.old_text.split('\n');
            const firstLine = lines[0]?.trim();

            if (firstLine && content.includes(firstLine)) {
                return {
                    success: false,
                    output: '',
                    error: `Exact text not found, but similar content exists. Check whitespace and indentation. The first line "${firstLine.slice(0, 50)}..." was found but the full text doesn't match exactly.`
                };
            }

            return {
                success: false,
                output: '',
                error: `Text to replace not found in file. Make sure old_text matches exactly including whitespace and indentation.`
            };
        }

        const occurrences = content.split(input.old_text).length - 1;
        if (occurrences > 1) {
            return {
                success: false,
                output: '',
                error: `Found ${occurrences} occurrences of the text. Include more context to make the match unique.`
            };
        }

        const newContent = content.replace(input.old_text, input.new_text);
        await Bun.write(filePath, newContent);

        const oldLines = input.old_text.split('\n').length;
        const newLines = input.new_text.split('\n').length;
        const lineChange = newLines - oldLines;
        const lineChangeStr = lineChange === 0 ? 'same number of lines' : lineChange > 0 ? `+${lineChange} lines` : `${lineChange} lines`;

        return {
            success: true,
            output: `File edited: ${relative(PROJECT_ROOT, filePath)} (${lineChangeStr})\n\nReplaced:\n\`\`\`\n${input.old_text.slice(0, 200)}${input.old_text.length > 200 ? '...' : ''}\n\`\`\`\n\nWith:\n\`\`\`\n${input.new_text.slice(0, 200)}${input.new_text.length > 200 ? '...' : ''}\n\`\`\``
        };
    } catch (error) {
        return {
            success: false,
            output: '',
            error: error instanceof Error ? error.message : 'Unknown error editing file'
        };
    }
}

export async function executeTool(name: ToolName, input: unknown): Promise<ToolResult> {
    switch (name) {
        case 'list_directory':
            return executeListDirectory(input as ListDirectoryInput);
        case 'read_file':
            return executeReadFile(input as ReadFileInput);
        case 'edit_file':
            return executeEditFile(input as EditFileInput);
        default:
            return {
                success: false,
                output: '',
                error: `Unknown tool: ${name}`
            };
    }
}
