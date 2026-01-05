
# MtaaBot API Specification v1.0

## 1. Authentication
All API requests (except webhooks) require a Bearer token in the `Authorization` header.
`Authorization: Bearer <MTAABOT_API_KEY>`

## 2. WhatsApp Webhook
**Endpoint**: `POST /v1/webhook/whatsapp`
**Purpose**: Receives incoming messages from Meta/WhatsApp Business API.

### Inbound Message Schema
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": { "display_phone_number": "254...", "phone_number_id": "..." },
        "messages": [{
          "from": "254712345678",
          "id": "msg_id_123",
          "timestamp": "1625000000",
          "text": { "body": "Niaje, raba ni mulla ngapi?" },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

## 3. Knowledge Base API
**Endpoint**: `POST /v1/knowledge/ingest`
**Purpose**: Upsert product data or business FAQs into the Vector DB (RAG).

### Request Payload
```json
{
  "businessId": "biz_99",
  "data": [
    {
      "id": "prod_01",
      "text": "Original Levi Jeans, KES 2500, Available in Nairobi. Great for casual wear.",
      "metadata": { "category": "fashion", "price": 2500 }
    }
  ]
}
```

## 4. Conversation History
**Endpoint**: `GET /v1/conversations/{phone_number}`
**Purpose**: Retrieve transcript for manual takeover or analysis.

## 5. M-Pesa Integration (Monetization)
**Endpoint**: `POST /v1/billing/stk-push`
**Purpose**: Triggers a Safaricom STK Push to the user's phone for subscription payment.

### Request Payload
```json
{
  "phone": "254700000000",
  "amount": 750,
  "accountReference": "MtaaBot_Lite_Plan"
}
```

## 6. Response Headers
All responses include:
- `X-MtaaBot-Confidence`: 0.0 to 1.0
- `X-MtaaBot-Latency`: Processing time in ms
- `X-MtaaBot-Language`: Detected dialect (SHENG|SWA|ENG)
