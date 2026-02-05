# cURL Commands for Testing

Ready-to-use cURL commands for testing the n8n Lead Capture workflow.

> **Note**: Replace `YOUR_WEBHOOK_URL` with your actual webhook URL from n8n.

---

## Basic Commands

### 1. Valid Lead Submission

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "source": "Website Contact Form"
  }'
```

### 2. Full Lead with All Fields

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@company.com",
    "source": "Landing Page",
    "phone": "+1-555-123-4567",
    "company": "Acme Corporation",
    "message": "Interested in your services"
  }'
```

---

## Validation Tests

### 3. Missing Name (Should Fail)

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "source": "Test"
  }'
```

### 4. Missing Email (Should Fail)

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "source": "Test"
  }'
```

### 5. Empty Payload (Should Fail)

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 6. Invalid Email Format (Should Fail)

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "not-an-email",
    "source": "Test"
  }'
```

---

## Data Processing Tests

### 7. Whitespace Test (Should Be Trimmed)

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "  John Doe  ",
    "email": "  JOHN@EXAMPLE.COM  ",
    "source": "  Website  "
  }'
```

### 8. Special Characters Test

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "José García-López",
    "email": "jose@example.com",
    "source": "Campaña de Marketing"
  }'
```

---

## Edge Case Tests

### 9. Long Message Field

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "source": "Website",
    "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }'
```

### 10. Unicode Characters

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "田中太郎",
    "email": "tanaka@example.jp",
    "source": "Japan Campaign"
  }'
```

---

## Verbose Commands

### With Full Response Headers

```bash
curl -v -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "source": "Verbose Test"
  }'
```

### With Response Time

```bash
curl -w "\n\nTime Total: %{time_total}s\n" \
  -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "source": "Performance Test"
  }'
```

### Save Response to File

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "source": "Test"
  }' \
  -o response.json
```

---

## Batch Testing Script

Save as `test-workflow.sh`:

```bash
#!/bin/bash

WEBHOOK_URL="YOUR_WEBHOOK_URL"

echo "=== Testing Valid Lead ==="
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","source":"Batch Test"}'
echo -e "\n"

echo "=== Testing Missing Name ==="
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"Test"}'
echo -e "\n"

echo "=== Testing Missing Email ==="
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","source":"Test"}'
echo -e "\n"

echo "=== All Tests Complete ==="
```

---

## PowerShell Commands

For Windows users:

### Valid Lead

```powershell
$body = @{
    name = "John Doe"
    email = "john.doe@example.com"
    source = "PowerShell Test"
} | ConvertTo-Json

Invoke-RestMethod -Uri "YOUR_WEBHOOK_URL" -Method Post -Body $body -ContentType "application/json"
```

### With Error Handling

```powershell
try {
    $body = @{
        name = "Test User"
        email = "test@example.com"
        source = "PowerShell"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "YOUR_WEBHOOK_URL" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
```

---

## Expected Responses

### Success Response (200)

```json
{
  "status": "success",
  "message": "Lead captured successfully",
  "leadId": "lead_abc123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Validation Error Response (400)

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": ["Name is required"]
}
```

### Server Error Response (500)

```json
{
  "status": "error",
  "message": "An error occurred while processing your request"
}
```
