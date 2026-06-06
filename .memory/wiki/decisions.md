# Architectural Decisions

*Document major technical decisions, the rationale behind them, and alternatives considered.*

## ADR-001: Zero Runtime Dependencies
- **Decision:** Do not use any external npm packages for the runtime tool (e.g., no `commander`, `chalk`, `fs-extra`).
- **Rationale:** MemWiki is intended to be a "zero-friction" memory protocol. Keeping it dependency-free reduces the installation footprint, minimizes potential vulnerabilities, and keeps the tool robust and lightweight.

## ADR-002: Synchronous File I/O
- **Decision:** Use synchronous file operations (`fs.writeFileSync`, `fs.mkdirSync`) instead of asynchronous ones.
- **Rationale:** The CLI tool performs a single, fast initialization or update pass and exits. Asynchrony would introduce unnecessary complexity without any meaningful performance benefit for this specific use case.

## ADR-003: Hardcoded String Templates
- **Decision:** Store the `.cursorrules`, `CLAUDE.md`, and default wiki files as string literals directly in `src/index.ts`.
- **Rationale:** It simplifies the build process. If we used external template files, the TypeScript build step would also need to copy those non-TS files to the `dist/` directory before publishing to NPM. Hardcoding them avoids complex build scripts.

## ADR-004: Safe Updates
- **Decision:** The `update` command overwrites protocol files (`AGENTS.md`, `.cursorrules`, etc.) but never overwrites files inside `.memory/wiki/`.
- **Rationale:** Ensures that the agent prompts and hook configurations can evolve as the standard improves, without destroying the user's custom, project-specific knowledge stored in their wiki.
