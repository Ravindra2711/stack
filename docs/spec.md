# Software Design Document: Tech Stack Bulk Scanner (MVP)

## 1. Introduction

### 1.1 Purpose
The tool is designed to scan a list of git repositories (remote or local), analyze their technical structure (languages, frameworks, infrastructure, coding standards), and generate a comprehensive report. This document outlines the Minimum Viable Product (MVP) design, leveraging the existing `analyser`, `provider`, and `rules` modules found in the provided repository context.

### 1.2 Scope (MVP)
The MVP will focus on:
- Accepting a list of repository URLs or local paths as input.
- Cloning remote repositories to a temporary environment.
- Using the existing analysis engine to detect technologies.
- Aggregating findings into a structured JSON report.
- Providing a CLI interface for the `scanner` command.

*Note: CSV output, database storage, and detecting specific version numbers of technologies are explicitly out-of-scope for the MVP.*

## 2. System Overview

The system follows a pipeline architecture:
`Input -> Repo Manager -> Analysis Engine -> Reporter -> Output`

### 2.1 High-Level Components

1.  **CLI Entry Point**: The `scanner` executable.
2.  **Repo Manager**: Handles git operations (clone/pull) and prepares the target directory.
3.  **Analysis Adapter**: Bridges the specific repository path with the existing `analyser` core.
4.  **Core Analyser** (Existing): The logic currently in `src/analyser` and `src/rules`.
5.  **Reporter**: Formats the aggregated analysis results.

## 3. Detailed Component Design

### 3.1 Input Module
- **Responsibility**: Read and parse the list of repositories to scan.
- **Input Format**: JSON file (`[{"name": "...", "url": "..."}]`) or plain text file (one URL or path per line).
- **Name Derivation**: For text input, the repo name is derived from the URL (e.g., `https://github.com/org/repo.git` -> `repo`).
- **Data Structure**:
  ```typescript
  interface RepoEntry {
    name: string; // Identifier
    url: string;  // Git URL or Local Path
  }
  ```

### 3.2 Repo Manager
- **Responsibility**: Ensure the code is available locally.
- **Path Logic**:
  - **Remote**: Clones to `/tmp/scanner-workspace/<safe_name>` (where `safe_name` is `slugify(name)` + hash of URL to prevent collisions).
  - **Local**: Validates path exists and prevents traversal outside allowed bounds (simple check against sensitive roots).
- **Git Operations**:
  - If target folder exists: Check if `git remote get-url origin` matches input URL.
    - Match: `git pull`
    - Mismatch: Error or overwrite (default: Error).
  - If folder missing: `git clone`.
  - **Auth**: MVP supports public repositories only. Private repos work if the environment has SSH keys/credentials pre-configured.
- **Security Check**: Validate URLs to prevent command injection (ensure protocol is `http`, `https`, `ssh`, or `file`).
- **Cleanup**: Optional flag `--cleanup` to remove cloned repos after scanning.

### 3.3 Analysis Adapter
- **Responsibility**: Instantiate the existing `FSProvider` and run the `analyser`.
- **Integration**:
  - Import `analyser` from `src/analyser/index.ts`.
  - Import `FSProvider` from `src/provider/fs.ts`.
  - **Payload Structure**: The `analyser` returns a defined `Payload` object (which typically contains a `childs` array or similar structure depending on the implementation in `src/payload/index.ts`, representing the analysis tree).
- **Flow**:
  ```typescript
  const provider = new FSProvider({ path: repoPath });
  const result = await analyser({ provider });
  ```
  *(Note: `npm install` is NOT performed. Analysis is purely static.)*

### 3.4 Reporter
- **Responsibility**: Flatten the hierarchical `Payload` into a report.
- **Logic**:
  - Iterate through the analysis result.
  - **Categorization**: Use the `type` field from the rule definition (e.g., `tool`, `language`, `framework`, `hosting`, `ci`, etc.) to group findings.
  - **Data Mapping**:
    - `framework`: Matches with `type: 'framework'` or `type: 'app'`.
    - `language`: Matches with `type: 'language'`.
    - `tool`: Matches with `type: 'tool'`, `type: 'saas'`, `type: 'monitoring'`, etc.
    - `database`: Matches with `type: 'db'`.
- **Output Format (JSON)**:
  ```json
  [
    {
      "repo": "my-project",
      "status": "success",
      "results": {
        "languages": ["TypeScript", "Rust"],
        "frameworks": ["React"],
        "tools": ["Docker", "Terraform"],
        "databases": ["PostgreSQL"]
      }
    },
    {
      "repo": "failed-repo",
      "status": "error",
      "error": "Git clone failed: Authentication required"
    }
  ]
  ```

## 4. Workflows

### 4.1 Scan Command
`node bin/scanner.js scan [options]`

**Options**:
- `-i, --input <file>`: Path to input (JSON/TXT).
- `-o, --output <file>`: Path to output JSON.
- `--concurrency <number>`: Number of parallel scans (default: 1).
- `--cleanup`: Remove temp folders after scan.

**Execution Flow**:
1.  Parse arguments.
2.  Read inputs into `RepoEntry[]`.
3.  Init `workerPool(concurrency)`.
4.  **For each** repo (processed in parallel chunks):
    a.  **Repo Manager**: Prepare directory.
    b.  **Analysis Adapter**: Run scan.
    c.  **Reporter**: Process result.
    d.  **Error Handling**: Catch exceptions and mark repo status as `error`.
    e.  **Cleanup**: If enabled, remove directory.
5.  Write complete `report.json`.

## 5. Technical Stack

- **Runtime**: Node.js.
- **Language**: TypeScript.
- **Dependencies**:
  - `commander`: CLI parsing.
  - `simple-git`: Git operations.
  - `fs-extra`: Extended file operations.
  - `consola`: Logging (consistent with existing tests).
  - `p-map` or similar: For concurrency control.

## 6. Implementation Plan (MVP)

1.  **Scaffolding**: Create `src/bin/scanner.ts` and `src/scan/` directory.
2.  **Repo Manager**: Implement `src/scan/repo-manager.ts` (Clone, Pull, Validation, Hash-naming).
3.  **Adapter**: Implement `src/scan/adapter.ts` wrapping `FSProvider` and `analyser`.
4.  **Core Loop**: Implement `src/scan/index.ts` using `p-map` for concurrency.
5.  **CLI**: Connect `commander` in `src/bin/scanner.ts`.
6.  **Reporter**: Implement payload transformation logic.

## 7. Future Considerations (Non-MVP)

- **Deep Version Detection**: parsing `package.json`/`pom.xml` for exact versions.
- **Diff Mode**: Compare previous report with current.
- **Database Backend**: Post output to PostgreSQL/MongoDB.
- **GitHub API Provider**: Direct API scanning to bypass cloning.
