---
name: graphify
description: Build a knowledge graph from your codebase for 71.5x token reduction per query
category: code
triggers:
  - graphify
  - knowledge graph
  - codebase graph
  - token reduction
---

# Graphify — Codebase Knowledge Graph

Build a NetworkX knowledge graph from code, docs, PDFs, and images. Query the graph instead of grepping — 71.5x token savings per query.

## Install

```bash
pip install graphifyy
graphify install
```

## Usage

```bash
graphify build .          # Build graph from current directory
graphify query "how does auth work?"  # Query the graph
graphify serve            # Interactive HTML visualization
```

## What It Does

1. **Detects** files (code, docs, PDFs, images)
2. **Extracts** entities and relationships via AST + Claude subagents
3. **Builds** a NetworkX graph with confidence labels (EXTRACTED/INFERRED/AMBIGUOUS)
4. **Exports** interactive HTML, graph.json, GRAPH_REPORT.md

## Integration

- Installs as a Claude Code skill (`/graphify`)
- PreToolUse hook redirects Glob/Grep through the graph
- SHA256 cache — only reprocesses changed files

## Links

- **GitHub:** https://github.com/safishamsi/graphify
- **License:** MIT
- **Stars:** 5,897+
