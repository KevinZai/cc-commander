---
name: cc-knowledge
description: "CC Commander Knowledge Base — search past lessons, view learning history. Use when the user says 'what did we learn', 'past lessons', 'knowledge base', 'what went wrong before', or 'search knowledge'."
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# Knowledge Base

Search and display the CC Commander knowledge base at ~/.claude/commander/knowledge/.

## Commands

- **Search**: Find lessons relevant to a topic by scanning keywords
- **List**: Show recent lessons with category and outcome
- **Stats**: Show knowledge base statistics (total lessons, categories, costs)

## Lesson Format

Each lesson in the knowledge base contains:
- Task description and keywords
- Category (web, api, cli, content, social, research, etc.)
- Outcome (success, error, cancelled)
- Tech stack used
- Error patterns encountered
- Success patterns identified
- Result summary

Read JSON files from ~/.claude/commander/knowledge/ and present them in a readable format.
