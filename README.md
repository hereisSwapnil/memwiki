<h1 align="center">🧠 memwiki</h1>
<p align="center">
  <strong>A zero-friction, persistent project memory protocol for AI agents.</strong>
</p>
<p align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/memwiki?color=blue&style=flat-square">
  <img alt="License" src="https://img.shields.io/npm/l/memwiki?style=flat-square">
  <img alt="Zero Dependencies" src="https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square">
</p>

---

AI coding agents (like Cursor, Claude Code, GitHub Copilot) suffer from "Agent Amnesia". When you start a new session, the agent forgets why certain architectural decisions were made, the project's tech stack quirks, known bugs, and the immediate context.

`memwiki` gives your project a persistent brain. It leverages the fact that modern AI agents naturally read markdown files in your workspace, providing a standardized, vendor-agnostic memory system without requiring complex plugins or subscriptions.

## Getting Started

Initialize `memwiki` in the root of any project:

```bash
npx memwiki init
```

That's it. Your project now has a persistent memory.

### Updating the Protocol
As `memwiki` evolves and we release better agent prompts and slash commands, you can update your existing project's protocol files without overwriting your actual memory wiki:

```bash
npx memwiki update
```
This safely updates `AGENTS.md` and your root hooks (`.cursorrules`, `CLAUDE.md`, etc.) while leaving the contents of `.memory/wiki/` completely untouched.

## How It Works

When you run `npx memwiki init`, it creates a `.memory` directory and places specific hook files (`.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md`) directly in your project root. 

These root files act as the automatic "front door" for any AI agent that connects to your repository, explicitly instructing them: *"Hey! I have a brain. Please read `AGENTS.md` and `.memory/wiki/hot.md` before doing anything else."*

### The Folder Structure

```text
[Project Root]
├── .cursorrules           (Hook for Cursor)
├── .github/copilot-instructions.md (Hook for Copilot)
├── CLAUDE.md              (Hook for Claude Code)
├── AGENTS.md              (The master protocol file)
└── .memory/
    ├── .raw/              (Immutable source documents dropped by humans)
    └── wiki/
        ├── hot.md         (Hot cache: recent context & next steps - READ FIRST)
        ├── index.md       (Table of contents)
        ├── log.md         (Append-only changelog)
        ├── stack.md       (Tech stack details)
        ├── patterns.md    (Coding patterns and conventions)
        ├── bugs.md        (Known issues and quirks)
        └── decisions.md   (Architecture Decision Records)
```

### Reading & Synthesizing

1. **The Hot Cache (`hot.md`)**: Agents read this file *first*. It contains immediate, short-term context (~500 words). It tells the agent exactly what was being worked on and the immediate next steps.
2. **Immutable Sources (`.raw/`)**: Drop your PDF API docs, GitHub gists, or meeting notes here. Agents are instructed to *read* these files but *never* modify them. 
   - **How it works:** When you drop a file like `stripe-api.pdf` into `.raw/`, you simply tell your agent: *"Please process the new Stripe docs in the raw folder."* The agent will read the PDF and synthesize the important architectural details into a clean markdown file inside the `wiki/` folder, leaving the original PDF untouched as a source of truth.

### Autonomous Updating

Because modern AI tools have file editing capabilities, the `AGENTS.md` protocol contains explicit instructions for the agent to maintain the wiki proactively:

- "Whenever you learn a new coding pattern, fix a complex bug, or make a significant architectural decision, edit the corresponding file in \`.memory/wiki/\`."
- "Before ending a session, you MUST update \`.memory/wiki/hot.md\` with the current state and next steps, and append a summary to \`log.md\`."

## Using `memwiki` on Existing Projects

If you initialize `memwiki` on a project that has been in development for months, the `.memory/wiki/` files will start out mostly blank. How does the memory fill up?

There are two ways the memory gets populated:

**1. Organic Growth (The Lazy Way)**  
You don't *have* to do anything. As you continue working on the project and asking your AI agent to fix bugs or build features, the agent will naturally explore your codebase. Because of the rules in `AGENTS.md`, whenever the agent learns an established pattern or makes a new architectural decision during a session, it will automatically document it in the wiki.

**2. Active Ingestion (The Fast Way)**  
If you want the memory populated immediately, you can use one of the built-in agent slash commands.

### Scaling to Enterprise Projects
Are you worried that a single `patterns.md` file will grow to thousands of lines in a massive monorepo? Don't be! 

`memwiki` is not limited to the default starter files. The `AGENTS.md` protocol explicitly instructs your AI agent to **create new markdown files and subdirectories** as the project grows. 
For example, if you build a complex authentication system, the agent will dynamically create `.memory/wiki/auth-system.md` and link it to the master `index.md`. The `index.md` file acts as a Map of Content (MOC), routing the agent to the right domain-specific files without overflowing the context window.

### Agent Slash Commands

Because `AGENTS.md` explicitly teaches your AI tool how to behave, it also gives your agent "commands" you can run in your chat interface:

- `/memwiki-ingest`: The agent will scan your entire repository and populate `stack.md`, `patterns.md`, and `decisions.md` based on what it finds.
- `/memwiki-lint`: The agent will perform a health check on the wiki, fixing outdated information or filling in missing context.
- `/memwiki-fold`: The agent will condense older entries in `log.md` into a clean summary to prevent the log from becoming too large.

## Why `memwiki`?

- **Zero Friction:** One command setup.
- **Zero Lock-in:** It's just Markdown. 
- **Universal Compatibility:** Works seamlessly with Cursor, Claude, Copilot, or any tool that reads local files.
- **Team Scalability:** Ensures that whether a team member uses Cursor or Gemini, they both operate on the exact same project context.

## Inspired By
This pattern is heavily inspired by Andrej Karpathy's [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).
