import { SyntaxStyle, RGBA } from '@opentui/core';

export const syntaxStyle = SyntaxStyle.fromStyles({
    keyword: { fg: RGBA.fromHex('#ff7b72'), bold: true },
    'keyword.import': { fg: RGBA.fromHex('#ff7b72'), bold: true },
    'keyword.operator': { fg: RGBA.fromHex('#ff7b72') },

    string: { fg: RGBA.fromHex('#a5d6ff') },
    comment: { fg: RGBA.fromHex('#8b949e'), italic: true },
    number: { fg: RGBA.fromHex('#79c0ff') },
    boolean: { fg: RGBA.fromHex('#79c0ff') },
    constant: { fg: RGBA.fromHex('#79c0ff') },

    function: { fg: RGBA.fromHex('#d2a8ff') },
    'function.call': { fg: RGBA.fromHex('#d2a8ff') },
    'function.method.call': { fg: RGBA.fromHex('#d2a8ff') },
    type: { fg: RGBA.fromHex('#ffa657') },
    constructor: { fg: RGBA.fromHex('#ffa657') },

    variable: { fg: RGBA.fromHex('#e6edf3') },
    'variable.member': { fg: RGBA.fromHex('#79c0ff') },
    property: { fg: RGBA.fromHex('#79c0ff') },

    operator: { fg: RGBA.fromHex('#ff7b72') },
    punctuation: { fg: RGBA.fromHex('#f0f6fc') },
    'punctuation.bracket': { fg: RGBA.fromHex('#f0f6fc') },
    'punctuation.delimiter': { fg: RGBA.fromHex('#c9d1d9') },

    'markup.heading': { fg: RGBA.fromHex('#58a6ff'), bold: true },
    'markup.heading.1': { fg: RGBA.fromHex('#58a6ff'), bold: true, underline: true },
    'markup.heading.2': { fg: RGBA.fromHex('#38bdf8'), bold: true },
    'markup.bold': { fg: RGBA.fromHex('#f0f6fc'), bold: true },
    'markup.strong': { fg: RGBA.fromHex('#f0f6fc'), bold: true },
    'markup.italic': { fg: RGBA.fromHex('#f0f6fc'), italic: true },
    'markup.list': { fg: RGBA.fromHex('#ff7b72') },
    'markup.quote': { fg: RGBA.fromHex('#8b949e'), italic: true },
    'markup.raw': { fg: RGBA.fromHex('#a5d6ff') },
    'markup.raw.block': { fg: RGBA.fromHex('#a5d6ff') },
    'markup.link': { fg: RGBA.fromHex('#58a6ff'), underline: true },
    'markup.link.url': { fg: RGBA.fromHex('#58a6ff'), underline: true },

    default: { fg: RGBA.fromHex('#e6edf3') }
});
