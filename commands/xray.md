Read-only project health audit. Scans the current directory (or a specified path) and produces a scored report card.

Runs three pure Node.js modules — no LLM calls, no network, completes in under 200ms:
1. **Signal Scanner** — detects language, framework, package manager, quality gaps
2. **Rule Engine** — maps signals to CCC skill recommendations with weighted scoring
3. **Report Generator** — health score (0-100), maturity level (1-5), prioritized recommendations

Output includes:
- Health score with breakdown across 6 dimensions (security, testing, maintainability, dependencies, devops, documentation)
- Maturity level (Initial through Optimizing)
- Critical issues requiring immediate attention
- Prioritized CCC skill recommendations
- Quick wins achievable in under 2 hours
- Technical debt classification (Fowler Quadrant)
- Project summary (language, framework, files, lines, deps)

After the report, run `/makeover` to execute prioritized fixes with an agent swarm.

Args: $ARGUMENTS (optional: path to project directory, defaults to current directory)
