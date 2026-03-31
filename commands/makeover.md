Transform a project by executing prioritized fixes from an /xray report using a coordinated agent swarm.

Steps:
1. Run `/xray` if no prior report exists — collect project signals and health score
2. Present findings and ask 5-7 scope-narrowing questions (goal, time budget, risk tolerance, priorities, exclusions, cost ceiling)
3. Generate `makeover-plan.md` — prioritized action plan with effort/impact estimates
4. Get user approval on the plan
5. Dispatch domain agents (security, testing, CI, docs, quality) — each in its own git worktree
6. Each agent runs a verification loop: typecheck -> lint -> test -> commit or retry
7. Circuit breaker: 3 consecutive failures in any agent -> pause and escalate
8. Generate before/after report card showing score delta and what shipped

Safeguards:
- Every change is a focused, conventional commit
- Git worktree isolation prevents conflicts between agents
- Cost ceiling (default $5) prevents runaway spending
- All changes can be rolled back by discarding the worktree

Args: $ARGUMENTS (optional: path to project directory, defaults to current directory)
