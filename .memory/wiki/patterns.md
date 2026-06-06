# Coding Patterns

*Document established coding conventions, file structures, and UI/UX patterns here.*

## CLI Architecture
- The CLI is implemented as a simple script in `src/index.ts`.
- Commands are parsed minimally using `process.argv[2]`. Supported commands are `init` and `update`.

## File System Operations
- The project relies heavily on Node.js core `fs` and `path` modules.
- Operations are performed synchronously (e.g., `fs.writeFileSync`, `fs.mkdirSync`, `fs.existsSync`). This is acceptable and preferred for this simple, short-lived CLI tool.

## Templating
- File contents for initialization are stored as hardcoded string templates within a `Record<string, string>` object in the code.
- This pattern avoids the need for a separate `templates/` directory to manage during build and distribution.
