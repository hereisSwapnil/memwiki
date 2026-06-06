# Tech Stack

*Document the core technologies, versions, and deployment details here.*

## Core Technologies
- **Node.js**: Execution environment for the CLI tool.
- **TypeScript**: Primary programming language (target: ES2022, module: Node16).

## Build & Tooling
- **tsc**: Built-in TypeScript compiler is used for the build process (`npm run build`).
- **npm**: Package manager.

## Key Principles
- **Zero Dependencies**: The project explicitly avoids runtime dependencies (only `@types/node` and `typescript` as devDependencies) to ensure zero friction and high security/stability.
