export class Range {
    constructor(
        public readonly start: { line: number; character: number },
        public readonly end: { line: number; character: number }
    ) {}
}

// Overload to match vscode.Range(startLine, startChar, endLine, endChar)
export const RangeConstructor = function (
    startLineOrPosition: number,
    startCharacter: number,
    endLine: number,
    endCharacter: number
) {
    return new Range(
        { line: startLineOrPosition, character: startCharacter },
        { line: endLine, character: endCharacter }
    );
} as unknown as typeof Range;

export class CodeLens {
    constructor(
        public readonly range: InstanceType<typeof Range>,
        public readonly command?: { title: string; command: string; arguments?: unknown[] }
    ) {}
}

export const window = {
    showErrorMessage: (_message: string) => {},
    terminals: [] as { name: string; show: () => void; sendText: (text: string) => void }[],
    createTerminal: (opts: { name: string; cwd?: string }) => ({
        name: opts.name,
        show: () => {},
        sendText: (_text: string) => {}
    })
};

export const workspace = {
    workspaceFolders: undefined as { uri: { fsPath: string } }[] | undefined
};

export const languages = {
    registerCodeLensProvider: () => ({ dispose: () => {} })
};

export const commands = {
    registerCommand: (_id: string, _handler: (...args: unknown[]) => void) => ({ dispose: () => {} })
};

export interface CodeLensProvider {
    provideCodeLenses(document: TextDocument): CodeLens[];
}

export interface TextDocument {
    getText(): string;
    uri: { fsPath: string };
    positionAt(offset: number): { line: number };
}
