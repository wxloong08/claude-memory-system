# Memory Hub — AI Cross-Platform Memory System

Capture and sync conversations across **all major AI platforms** to provide seamless context continuity.

> Switch between Claude, ChatGPT, Gemini, Grok, DeepSeek — your context follows you.

## Supported Platforms

| Platform | Capture Method | Status |
|----------|---------------|--------|
| Claude Web | Browser Extension | ✅ |
| ChatGPT | Browser Extension | ✅ |
| Gemini Web | Browser Extension | ✅ |
| Grok | Browser Extension | ✅ |
| DeepSeek | Browser Extension | ✅ |
| Claude Code | Hook Integration | ✅ |
| Codex CLI | Session Import | ✅ |
| Gemini CLI | Session Import | ✅ |

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+ (for Web UI development)
- Chrome or Chromium-based browser

### 1. Install Backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start Memory Hub

```bash
cd backend
python main.py
# Or: uvicorn main:app --reload --port 8765
```

Memory Hub runs at `http://localhost:8765`. Web UI at `http://localhost:5173` (dev mode).

### 3. Start Web UI (Development)

```bash
cd web-ui
npm install
npm run dev
```

### 4. Install Browser Extension

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `browser-extension/` folder
4. Navigate to any supported AI platform and click the extension icon

### 5. (Optional) Install Claude Code Hook

```bash
cd claude-code-integration
./install.sh
```

Automatically injects recent conversation context when Claude Code starts.

## How It Works

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Browser Extension   │────▶│   Memory Hub     │────▶│   Web UI        │
│  (5 AI platforms)    │     │   (FastAPI)      │     │   (Vue 3)       │
└─────────────────────┘     └────────┬─────────┘     └─────────────────┘
                                     │
┌─────────────────────┐     ┌────────┴─────────┐
│  Claude Code Hook    │◀───│  SQLite + Chroma  │
│  (auto-inject)       │     │  (local storage)  │
└─────────────────────┘     └──────────────────┘
```

1. **Capture**: Browser extension detects conversations on AI platforms
2. **Store**: Memory Hub saves to SQLite (data) + ChromaDB (vector search)
3. **Analyze**: AI-powered summarization, importance scoring, memory extraction
4. **Inject**: Claude Code hook loads relevant context on startup
5. **Manage**: Web UI for browsing, searching, and managing memories

## Project Structure

```
memory-hub/
├── backend/                  # FastAPI service (Python)
│   ├── main.py              # API server (~50 endpoints)
│   ├── database.py          # SQLite layer (V1)
│   ├── database_v2.py       # V2 archive + switch engine
│   ├── vector_store.py      # ChromaDB vector search
│   ├── ai_providers.py      # Multi-provider AI integration
│   ├── backup_export.py     # Backup & restore
│   └── tests/               # API contract tests
│
├── web-ui/                   # Vue 3 SPA + Tailwind CSS
│   └── src/views/           # Dashboard, Conversations, Memories, Settings
│
├── browser-extension/        # Chrome Extension (Manifest V3)
│   ├── platforms/           # Per-platform extractors
│   └── core/                # Shared extraction logic
│
├── claude-code-integration/  # Claude Code hook
├── cli/                      # CLI tool (memory-hub)
├── scripts/                  # Import & utility scripts
└── docs/                     # Documentation
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key settings:
- `MEMORY_HUB_PORT` — Server port (default: 8765)
- `ANTHROPIC_API_KEY` — For AI analysis features
- AI provider settings configurable via Web UI **Settings** page

## API Reference

### Quick Examples

```bash
# Health check
curl http://localhost:8765/health

# Get conversation context (for hook integration)
curl "http://localhost:8765/api/context?hours=24"

# Search conversations
curl "http://localhost:8765/api/search?q=memory+system"

# List conversations
curl "http://localhost:8765/api/conversations?limit=20"
```

Full API documentation: [docs/API_V2_REFERENCE.md](docs/API_V2_REFERENCE.md)

## V2: Cross-CLI Context Switching

Memory Hub V2 adds a **three-layer memory architecture** and **CLI quick switch** for seamless context transfer between CLI tools.

### Three-Layer Memory

| Layer | Purpose | Persistence |
|-------|---------|-------------|
| **Archive** | Full conversation transcripts | Permanent |
| **Core** | Structured knowledge: facts, preferences, decisions | Long-term |
| **Working** | Active task state per workspace | Session-scoped |

### CLI Switch Tool

```bash
memory-hub switch --to gemini_cli     # Switch with context injection
memory-hub status                      # View workspace state
memory-hub save-state --task "..."     # Save working state
memory-hub import --source all         # Import local sessions
memory-hub search <query>              # Search conversations
```

## Development

### Run Tests

```bash
cd backend
python -m pytest tests/test_api_contracts.py -x -q
```

### Build Web UI

```bash
cd web-ui
npm run build
```

### Manual Testing

```bash
# Verify backend
curl http://localhost:8765/health
# Expected: {"status":"healthy","database":"ok","vector_store":"ok"}

# Verify extension connection
# Open popup on any AI platform → should show "Connected"
```

## Privacy & Security

- **Local-first**: All data stored locally, never uploaded to external servers
- **Localhost-only**: Memory Hub only accessible from your machine
- **User control**: Delete any conversation or memory anytime
- **No tracking**: No analytics or external connections

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](ARCHITECTURE.md) | System design & V2 three-layer model |
| [API V2 Reference](docs/API_V2_REFERENCE.md) | Complete API documentation |
| [User Manual](docs/USER_MANUAL.md) | Detailed usage guide (Chinese) |
| [CLI Switch Guide](docs/CLI_SWITCH_GUIDE.md) | CLI switching guide (Chinese) |
| [V2 Migration Guide](docs/V2_MIGRATION_GUIDE.md) | Upgrading from V1 to V2 |
| [Import Guide](docs/IMPORT_GUIDE.md) | Importing local sessions |

## License

[MIT License](LICENSE)
