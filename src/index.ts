#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const command = process.argv[2];

if (command !== 'init' && command !== 'update') {
  console.log('Usage: npx memwiki init | npx memwiki update');
  process.exit(1);
}

console.log(`Running memwiki ${command}...`);

const targetDir = process.cwd();

const files: Record<string, string> = {
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

This project uses **MemWiki** (inspired by the [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)), a persistent compounding knowledge base for AI coding agents.

## 1. Session Start (Reading)
Whenever you start a new session or task, you MUST:
1. READ \`.memory/wiki/hot.md\` immediately. This contains the immediate context, current state, and next steps.
2. If \`hot.md\` does not have enough context, consult \`.memory/wiki/index.md\` to find relevant domain pages.
3. If the user drops new API docs, PDF specs, or gists into \`.memory/.raw/\`, read them to understand the new information, but **never modify the files in \`.raw/\`**.

## 2. During Work (Synthesizing)
Whenever you learn a new coding pattern, fix a complex bug, or make a significant architectural decision:
- You MUST edit the corresponding file in \`.memory/wiki/\` (e.g., \`patterns.md\`, \`bugs.md\`, \`decisions.md\`).
- **Scale the Wiki:** If the project is large, DO NOT cram everything into the default files. Create new markdown files or subdirectories in \`.memory/wiki/\` for specific features, domains, or microservices (e.g., \`.memory/wiki/auth-system.md\`).
- If you create a new file, you MUST add a link to it in \`.memory/wiki/index.md\`.
- Synthesize any raw knowledge from \`.memory/.raw/\` into the wiki pages.
- Never delete knowledge from the wiki. Only append or refine.

## 3. Session End (Updating)
Before ending a session, completing a major task, or when you are about to lose context:
1. **Update Hot Cache:** You MUST update \`.memory/wiki/hot.md\` with the current state of the project and the immediate next steps for the next agent.
2. **Log Work:** You MUST append a timestamped summary of your work to \`.memory/wiki/log.md\`.

## 4. Agent Slash Commands
The user may invoke specific commands. When you see these commands in the chat, execute the corresponding workflow:

- \`/memwiki-ingest\`: Trigger an active ingestion pass. Scan the entire repository and populate \`stack.md\`, \`patterns.md\`, and \`decisions.md\` based on your findings.
- \`/memwiki-lint\`: Perform a health check on the wiki. Look for outdated information, missing context in \`hot.md\`, or empty domain pages, and propose fixes.
- \`/memwiki-fold\`: Condense older entries in \`log.md\` into a summarized paragraph to keep the file from becoming too long, while preserving crucial history.
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

*(Agents: Create new files for specific features or domains as the project scales, and link them here).*
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

const createDirIfNotExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Ensure .memory directories exist
createDirIfNotExists(path.join(targetDir, '.github'));
createDirIfNotExists(path.join(targetDir, '.memory', '.raw'));
createDirIfNotExists(path.join(targetDir, '.memory', 'wiki'));

let updatedCount = 0;

for (const [relativePath, content] of Object.entries(files)) {
  const filePath = path.join(targetDir, relativePath);
  
  const isProtocolFile = relativePath === 'AGENTS.md' || relativePath === '.cursorrules' || relativePath === '.github/copilot-instructions.md' || relativePath === 'CLAUDE.md';

  if (command === 'update' && isProtocolFile) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`🔄 Updated: ${relativePath}`);
    updatedCount++;
  } else if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Created: ${relativePath}`);
    updatedCount++;
  } else {
    console.log(`⚠️ Skipped (already exists): ${relativePath}`);
  }
}

if (updatedCount > 0) {
  console.log(`\n🚀 MemWiki ${command} completed successfully!`);
} else {
  console.log('\n✅ Everything is already up to date.');
}
