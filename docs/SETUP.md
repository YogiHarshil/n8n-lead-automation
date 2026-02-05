# Setup Guide

## Prerequisites

- n8n instance (Cloud or self-hosted)
- Google account (for Google Sheets)
- Airtable account (free tier works)

---

## Step 1: Import Workflow

1. Open n8n
2. Go to **Workflows** → **Import from File**
3. Select `workflow.json`
4. Click **Import**

---

## Step 2: Create Google Sheet

Create a new spreadsheet with these column headers in row 1:

```
Lead ID | Name | Email | Source | Phone | Company | Message | Status | Created At
```

---

## Step 3: Configure Google Sheets Node

1. Click **"Google Sheets - Add Lead"** node
2. Click **Credential** dropdown → **Create New**
3. Sign in with Google and allow access
4. Back in the node:
   - **Document**: Select your spreadsheet
   - **Sheet**: Select "Sheet1"

---

## Step 4: Create Airtable Table

Create a table with these fields:

| Field | Type |
|-------|------|
| Lead ID | Single line text |
| Name | Single line text |
| Email | Email |
| Source | Single line text |
| Phone | Phone number |
| Company | Single line text |
| Message | Long text |
| Status | Single select (new, contacted, qualified) |
| Created At | Date |

---

## Step 5: Configure Airtable Node

1. Click **"Airtable - Create Record"** node
2. Click **Credential** dropdown → **Create New**
3. Get Personal Access Token from [Airtable](https://airtable.com/create/tokens):
   - Create token with scopes: `data.records:read`, `data.records:write`
   - Add your base under "Access"
4. Paste token in n8n
5. Back in the node:
   - **Base**: Select your base
   - **Table**: Select your table

---

## Step 6: Activate & Get Webhook URL

1. Toggle workflow **ON** (top right)
2. Click **Webhook** node
3. Copy the **Production URL**

---

## Step 7: Test

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","source":"Setup Test"}'
```

Or use `demo/index.html` for browser testing.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow not responding | Toggle workflow ON |
| "Document not found" | Re-select spreadsheet in node |
| Airtable permission error | Check token has base access |
| 500 error | Check credentials are connected |

---

## Next Steps

- See [TESTING.md](TESTING.md) for test cases
- Open `demo/index.html` for visual testing
- Check `examples/curl-commands.md` for API tests
