# Security Policy

## Reporting Vulnerabilities

Email security issues to kevin@kevinz.ai. Do not open public issues for security bugs.

## Environment Variables

CC Commander uses these environment variables (never hardcode):
- `LINEAR_API_KEY_PERSONAL` — Linear API access
- `LINEAR_CC_CLIENT_ID` / `LINEAR_CC_CLIENT_SECRET` — Linear OAuth app

Store in `~/.openclaw/.env` or your preferred secret manager.

## Permissions

State files are written with mode 0600 (owner-only).
Configuration files should be 0600 if they contain credentials.
