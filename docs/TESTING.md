# Testing Guide

## Quick Tests

### Test 1: Valid Lead
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","source":"Test"}'
```
**Expected:** 200 OK, lead saved to Google Sheets + Airtable

### Test 2: Missing Name
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```
**Expected:** 400 Error, "Name is required"

### Test 3: Invalid Email
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid-email"}'
```
**Expected:** 400 Error, "Invalid email format"

### Test 4: Full Payload
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@company.com",
    "phone": "(555) 123-4567",
    "company": "Acme Inc",
    "source": "Google Search",
    "message": "Interested in your services"
  }'
```
**Expected:** 200 OK, all fields saved

---

## Test Checklist

| Test | Expected Result |
|------|----------------|
| Valid lead | 200 + data saved |
| Missing name | 400 + error message |
| Missing email | 400 + error message |
| Invalid email | 400 + error message |
| Empty payload | 400 + error message |
| Full payload | 200 + all fields saved |
| Special chars | Data preserved correctly |

---

## Using the Demo Form

1. Open `demo/index.html`
2. Configure webhook URL
3. Fill form and submit
4. Check Google Sheets for new row
5. Check Airtable for new record

---

## Debugging

### Check n8n Execution Logs
1. Go to **Executions** in n8n
2. Click on failed execution
3. Click the red node to see error details

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 500 Internal Error | Missing credentials | Configure node credentials |
| "Spreadsheet not found" | Wrong document selected | Re-select spreadsheet in node |
| "Invalid API key" | Airtable token issue | Regenerate PAT in Airtable |
| CORS error | Browser security | Use cURL or deploy form |

---

## PowerShell Test

```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    source = "PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Uri "YOUR_WEBHOOK_URL" -Method Post -Body $body -ContentType "application/json"
```
