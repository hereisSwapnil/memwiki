#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const command = process.argv[2];
if (command !== 'init') {
    console.log('Usage: npx memwiki init');
    process.exit(1);
}
console.log('Initializing memwiki project memory protocol...');
const targetDir = process.cwd();
const files = {
    // --- Root Hook Files ---
    '.cursorrules': `# MemWiki Integration
ALWAYS start your session by reading \`AGENTS.md\` and \`.memory/wiki/hot.md\` to get project context before suggesting code or answering questions.
`,
    '.github/copilot-instructions.md': `# MemWiki Integration
ALWAYS read \`AGENTS.md\` and \`.memory/wiki/hot.md\` to understand the project context, tech stack, and immediate next steps before coding.
`,
    'CLAUDE.md': `# MemWiki Integration
Please read \`AGENTS.md\` and \`.memory/wiki/hot.md\` as your primary source of truth for this project before answering any queries or making changes.
`,
    // --- The Protocol ---
    'AGENTS.md': `# MemWiki Protocol: Agent Instructions

This project uses **MemWiki**, a persistent compounding knowledge base for AI coding agents.

## 1. Session Start (Reading)
Whenever you start a new session or task, you MUST:
1. READ \`.memory/wiki/hot.md\` immediately. This contains the immediate context, current state, and next steps.
2. If \`hot.md\` does not have enough context, consult \`.memory/wiki/index.md\` to find relevant domain pages.
3. If the user drops new API docs, PDF specs, or gists into \`.memory/.raw/\`, read them to understand the new information, but **never modify the files in \`.raw/\`**.

## 2. During Work (Synthesizing)
Whenever you learn a new coding pattern, fix a complex bug, or make a significant architectural decision:
- You MUST edit the corresponding file in \`.memory/wiki/\` (e.g., \`patterns.md\`, \`bugs.md\`, \`decisions.md\`).
- Synthesize any raw knowledge from \`.memory/.raw/\` into the wiki pages.
- Never delete knowledge from the wiki. Only append or refine.

## 3. Session End (Updating)
Before ending a session, completing a major task, or when you are about to lose context:
1. **Update Hot Cache:** You MUST update \`.memory/wiki/hot.md\` with the current state of the project and the immediate next steps for the next agent.
2. **Log Work:** You MUST append a timestamped summary of your work to \`.memory/wiki/log.md\`.
`,
    // --- The Wiki Files ---
    '.memory/wiki/hot.md': `# Hot Cache

*This file is read first by agents to get immediate context. Agents must update this at the end of every session.*

## Current State
- Project initialized with MemWiki.

## Immediate Next Steps
- [ ] Define the project scope.
- [ ] Set up the initial tech stack.
`,
    '.memory/wiki/index.md': `# Project Wiki

*The central directory for all project knowledge.*

- [[hot.md]]: Immediate context and next steps.
- [[log.md]]: Append-only changelog of agent sessions.
- [[stack.md]]: Tech stack details and versions.
- [[patterns.md]]: Established coding patterns and conventions.
- [[bugs.md]]: Known issues, quirks, and workarounds.
- [[decisions.md]]: Architecture Decision Records (ADRs).
`,
    '.memory/wiki/log.md': `# Work Log

*Append-only changelog. Agents must append a timestamped summary of their work here at the end of each session.*

## Initial Setup
- Project memory initialized via MemWiki.
`,
    '.memory/wiki/stack.md': `# Tech Stack

*Document the core technologies, versions, and deployment details here.*

`,
    '.memory/wiki/patterns.md': `# Coding Patterns

*Document established coding conventions, file structures, and UI/UX patterns here.*

`,
    '.memory/wiki/bugs.md': `# Known Bugs & Quirks

*Document unresolved issues, edge cases, and weird system quirks here to prevent future agents from falling into the same traps.*

`,
    '.memory/wiki/decisions.md': `# Architectural Decisions

*Document major technical decisions, the rationale behind them, and alternatives considered.*

`
};
const createDirIfNotExists = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
// Ensure .memory directories exist
createDirIfNotExists(path_1.default.join(targetDir, '.github'));
createDirIfNotExists(path_1.default.join(targetDir, '.memory', '.raw'));
createDirIfNotExists(path_1.default.join(targetDir, '.memory', 'wiki'));
let createdCount = 0;
for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path_1.default.join(targetDir, relativePath);
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Created: ${relativePath}`);
        createdCount++;
    }
    else {
        console.log(`⚠️ Skipped (already exists): ${relativePath}`);
    }
}
if (createdCount > 0) {
    console.log('\n🚀 MemWiki initialized successfully! Your AI agent now has a persistent brain.');
}
else {
    console.log('\n✅ MemWiki was already initialized.');
}
//# sourceMappingURL=index.js.map