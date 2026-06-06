# MemWiki Protocol: Agent Instructions

This project uses **MemWiki** (inspired by the [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)), a persistent compounding knowledge base for AI coding agents.

## 1. Session Start (Reading)
Whenever you start a new session or task, you MUST:
1. READ `.memory/wiki/hot.md` immediately. This contains the immediate context, current state, and next steps.
2. If `hot.md` does not have enough context, consult `.memory/wiki/index.md` to find relevant domain pages.
3. If the user drops new API docs, PDF specs, or gists into `.memory/.raw/`, read them to understand the new information, but **never modify the files in `.raw/`**.

## 2. During Work (Synthesizing)
Whenever you learn a new coding pattern, fix a complex bug, or make a significant architectural decision:
- You MUST edit the corresponding file in `.memory/wiki/` (e.g., `patterns.md`, `bugs.md`, `decisions.md`).
- **Scale the Wiki:** If the project is large, DO NOT cram everything into the default files. Create new markdown files or subdirectories in `.memory/wiki/` for specific features, domains, or microservices (e.g., `.memory/wiki/auth-system.md`).
- If you create a new file, you MUST add a link to it in `.memory/wiki/index.md`.
- Synthesize any raw knowledge from `.memory/.raw/` into the wiki pages.
- Never delete knowledge from the wiki. Only append or refine.

## 3. Session End (Updating)
Before ending a session, completing a major task, or when you are about to lose context:
1. **Update Hot Cache:** You MUST update `.memory/wiki/hot.md` with the current state of the project and the immediate next steps for the next agent.
2. **Log Work:** You MUST append a timestamped summary of your work to `.memory/wiki/log.md`.

## 4. Agent Slash Commands
The user may invoke specific commands. When you see these commands in the chat, execute the corresponding workflow:

- `/memwiki-ingest`: Trigger an active ingestion pass. Scan the entire repository and populate `stack.md`, `patterns.md`, and `decisions.md` based on your findings.
- `/memwiki-lint`: Perform a health check on the wiki. Look for outdated information, missing context in `hot.md`, or empty domain pages, and propose fixes.
- `/memwiki-fold`: Condense older entries in `log.md` into a summarized paragraph to keep the file from becoming too long, while preserving crucial history.
