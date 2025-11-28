# Changelog

All notable changes to the AME Freeletics Full theme will be documented in this file.

## [0.2.0] - 2025-11-28

### Added - Forum Structure Management System

#### Core Features
- **Four Master Topics Structure**: Implemented bullet-proof forum organization
  - 0. Assistance - Active troubleshooting and questions
  - 1. Insights - Field observations and lessons learned
  - 2. Guides - Educational hub for standard procedures
  - 3. Resources - Read-only library for official documentation

#### Configuration System
- `config/forum_topics.json` - Centralized topic configuration with ID tracking
- Topic IDs stored and managed automatically by sync script
- Hero card slots mapped to corresponding topics

#### Content Files
- `content/topics/assistance.md` - Assistance topic description
- `content/topics/insights.md` - Insights topic description
- `content/topics/guides.md` - Guides topic description
- `content/topics/resources.md` - Resources topic description
- `content/welcome.md` - Welcome/Start Here topic with routing guide

#### Automation & Tooling
- `scripts/sync_forum_structure.mjs` - Node.js script for Discourse API integration
  - Creates topics if they don't exist
  - Updates existing topic content
  - Automatically updates `settings.yaml` hero card links
  - Preserves AI Assistant (Card 4) configuration
- `package.json` - NPM scripts for easy execution
  - `npm run sync-forum` - Sync topics without welcome
  - `npm run sync-forum-with-welcome` - Full setup including welcome topic

#### Documentation
- `FORUM_SETUP.md` - Comprehensive setup and maintenance guide
- `QUICK_REFERENCE.md` - Quick decision tree and command reference
- `.env.example` - Environment variables template
- `.gitignore` - Prevents secrets from being committed
- Updated `README.md` with forum structure overview

#### Hero Card Integration
- Hero Card 1 → Assistance topic
- Hero Card 2 → Insights topic
- Hero Card 3 → Guides topic
- Hero Card 4 → AI Assistant (AME-Bot) - preserved with updated labels

#### Security
- Environment variable-based configuration (no hard-coded secrets)
- `.env` file support for local development
- Comprehensive `.gitignore` to prevent secret commits

### Changed
- Updated `settings.yaml` default hero card labels and descriptions
- Updated `README.md` with forum structure information
- Enhanced theme description to include structure management

### Technical Details
- Uses Discourse REST API for topic management
- Node.js 18+ required for sync script
- ES Modules (`.mjs`) for modern JavaScript
- Idempotent sync operations (safe to run multiple times)
- Graceful error handling with clear error messages

## [0.1.0] - 2025-10-08

### Initial Release
- Dark color scheme (AME Dark)
- Background + glassmorphism panels
- Custom header with brand logo
- Featured topics and banner styles
- Category header/banner styles
- Right sidebar styles (desktop)
- Mobile layout tweaks
- Homepage hero banner via JavaScript
- Inter font import
- Chat widget integration
- Rotating brand quotes

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes
