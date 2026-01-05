
# MtaaBot Database Schema v1.0

Designed for PostgreSQL with JSONB support for flexible SME metadata.

## 1. Core Tables

### `businesses`
Stores the primary profile for each SME.
```sql
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    tone VARCHAR(50) DEFAULT 'mtaa', -- mtaa, rafiki, kazi, sana
    whatsapp_number VARCHAR(20) UNIQUE,
    timezone VARCHAR(50) DEFAULT 'Africa/Nairobi',
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, trial
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `api_configs`
Stores integration secrets and webhook settings.
```sql
CREATE TABLE api_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),
    mtaabot_api_key VARCHAR(255) UNIQUE,
    whatsapp_access_token TEXT,
    whatsapp_phone_number_id VARCHAR(100),
    webhook_verify_token VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `products`
The inventory used for RAG-based context injection.
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    is_available BOOLEAN DEFAULT true,
    metadata JSONB, -- For specific attributes like size, color, etc.
    vector_id VARCHAR(255), -- Reference to Pinecone/Vector DB ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Interaction Tables

### `conversations`
Groups messages by customer phone number.
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),
    customer_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'ai_active', -- ai_active, human_escalated, closed
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(business_id, customer_phone)
);
```

### `messages`
Individual message logs for analytics and context windows.
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(10) CHECK (role IN ('user', 'bot')),
    content TEXT NOT NULL,
    detected_language VARCHAR(20), -- SHENG, SWA, ENG
    confidence_score DECIMAL(3, 2),
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Billing & Plans

### `subscriptions`
Tracks M-Pesa payments and tier access.
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),
    plan_tier VARCHAR(20) DEFAULT 'lite', -- lite, pro, enterprise
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    mpesa_checkout_id VARCHAR(255),
    mpesa_receipt_number VARCHAR(255),
    is_active BOOLEAN DEFAULT true
);
```

## 4. Indices for Performance
```sql
CREATE INDEX idx_products_business ON products(business_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_customer ON conversations(customer_phone);
CREATE INDEX idx_products_metadata_gin ON products USING GIN (metadata);
```
