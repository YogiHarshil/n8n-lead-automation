# Lead Capture & CRM Automation

<img width="1474" height="601" alt="image" src="https://github.com/user-attachments/assets/c2aafd5b-e554-4239-9862-f13b6090d5ab" />

> Automated lead capture system that validates, processes, and syncs leads to Google Sheets + Airtable in real-time.

**Version:** 1.0.0
**Platform:** n8n (v1.0+)
**License:** MIT
**Author:** Harshil

---

## Overview

| Step | Action | Result |
|------|--------|--------|
| 1 | Form submitted | Webhook receives data |
| 2 | Validation | Checks required fields & email format |
| 3 | Processing | Cleans data, generates unique Lead ID |
| 4 | Storage | Saves to Google Sheets + Airtable |
| 5 | Response | Returns success/error to form |

---

## Workflow Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────────┐
│   Webhook   │───▶│   Validate   │───▶│  IF Valid   │───▶│  Process Lead    │
│ Lead Capture│    │    Input     │    │    Data     │    │      Data        │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────────┘
                                              │                    │
                                              ▼                    ▼
                                    ┌──────────────────┐  ┌──────────────────┐
                                    │    Respond -     │  │  Google Sheets   │
                                    │ Validation Error │  │    Add Lead      │
                                    └──────────────────┘  └──────────────────┘
                                                                   │
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │    Airtable      │
                                                          │  Create Record   │
                                                          └──────────────────┘
                                                                   │
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │    Respond -     │
                                                          │     Success      │
                                                          └──────────────────┘
```

---

## Demo

Open `demo/index.html` in your browser to test the workflow with a modern lead capture form featuring:
- Real-time validation
- Animated UI with floating particles
- Phone number auto-formatting
- Success/error notifications
- Keyboard shortcuts (Ctrl+Enter to submit)

---

## Requirements

- n8n instance (Cloud or self-hosted, v1.0+)
- Google account with Sheets access
- Airtable account (free tier supported)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **n8n** | Workflow automation engine |
| **Webhook** | Real-time lead ingestion |
| **Google Sheets** | Lead database & reporting |
| **Airtable** | CRM-style lead management |
| **HTML/CSS/JS** | Demo form (vanilla, no frameworks) |

---

## Quick Start

### 1. Import Workflow
```
n8n → Workflows → Import from File → workflow.json
```

### 2. Create Google Sheet
Add these columns to row 1:
```
Lead ID | Name | Email | Source | Phone | Company | Message | Status | Created At
```

### 3. Create Airtable Table
Create a table with these fields (all as **Single line text** for simplicity):
```
Lead ID | Name | Email | Source | Phone | Company | Message | Status | Created At
```

### 4. Configure Nodes
- Click **Google Sheets** node → Select your credential & spreadsheet
- Click **Airtable** node → Select your credential, base & table
- Enable **Typecast** option in Airtable node for auto field conversion

### 5. Activate & Test
- Toggle workflow **ON**
- Copy webhook URL from the Webhook node
- Open `demo/index.html`
- Enter webhook URL and submit a test lead

---

## API Reference

### Endpoint
```
POST /webhook/lead-capture
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "source": "Website",
  "phone": "+1 555-123-4567",
  "company": "Acme Inc",
  "message": "Interested in your services"
}
```

### Required Fields
- `name` - Lead's full name
- `email` - Valid email address

### Optional Fields
- `source` - Lead source (defaults to "Website")
- `phone` - Phone number
- `company` - Company name
- `message` - Additional message

### Success Response (200)
```json
{
  "status": "success",
  "message": "Lead captured successfully",
  "leadId": "lead_1705329000_a7k2m9",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response (400)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": ["Email is required"]
}
```

---

## Project Structure

```
n8n-lead-automation/
├── workflow.json          # n8n workflow definition
├── LICENSE                # MIT license
├── README.md              # This file
├── .gitignore             # Git ignore rules
├── demo/
│   ├── index.html         # Lead capture form UI
│   ├── style.css          # Responsive styling with animations
│   └── script.js          # Form logic & API client
├── docs/
│   ├── SETUP.md           # Step-by-step setup guide
│   └── TESTING.md         # Test cases & debugging
└── examples/
    ├── sample-payloads.json   # Test data payloads
    └── curl-commands.md       # API test commands
```

---

## Features

- **Input Validation** - Required field checks, email format validation
- **Data Enrichment** - Auto-generates Lead ID, timestamps, status
- **Multi-Destination Sync** - Google Sheets + Airtable simultaneously
- **Error Handling** - Graceful failures with clear error messages
- **Typecast Support** - Auto-creates Airtable select options
- **Modern Demo UI** - Animated form with real-time feedback
- **Production Ready** - No hardcoded credentials, secure by design

---

## Workflow Nodes

| Node | Type | Purpose |
|------|------|---------|
| Webhook - Lead Capture | Trigger | Receives POST requests |
| Validate Input | Code | Validates required fields & email |
| IF - Valid Data | Condition | Routes valid/invalid data |
| Process Lead Data | Code | Enriches data with ID & timestamps |
| Google Sheets - Add Lead | Integration | Appends lead to spreadsheet |
| Airtable - Create Record | Integration | Creates CRM record |
| Respond - Success | Response | Returns success JSON |
| Respond - Validation Error | Response | Returns error JSON |

---

## Testing

### Quick Test (cURL)
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","source":"API Test"}'
```

### PowerShell
```powershell
Invoke-RestMethod -Uri "YOUR_WEBHOOK_URL" -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","source":"PowerShell Test"}'
```

### Full Test Suite
See `docs/TESTING.md` for comprehensive test scenarios.

---

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](docs/SETUP.md) | Step-by-step setup guide |
| [TESTING.md](docs/TESTING.md) | Test cases & debugging |
| [curl-commands.md](examples/curl-commands.md) | Ready-to-use API tests |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow not responding | Ensure workflow is toggled ON |
| Google Sheets error | Re-select spreadsheet in node |
| Airtable empty fields | Enable Typecast option |
| Airtable field error | Change fields to Single line text |
| 400 validation error | Check name and email are provided |

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Extension Ideas

This workflow can be extended with:
- Email notifications (Gmail/Outlook)
- Slack/Discord alerts
- Lead scoring algorithms
- Additional CRM integrations (HubSpot, Salesforce)
- Duplicate detection
- Auto-responder emails

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

For bug reports and feature requests, please open an issue.
