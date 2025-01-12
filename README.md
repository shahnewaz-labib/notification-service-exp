# mock notification service

## Architecture Design

Generated using [GitDiagram](https://gitdiagram.com/)

```mermaid
flowchart TB
    subgraph Client
        C[Client Request]
    end

    subgraph "API Layer"
        ER["Email Routes"]:::api
        SR["SMS Routes"]:::api
        VM["Validation Middleware"]:::middleware
    end

    subgraph "Controller Layer"
        EC["Email Controller"]:::controller
        SC["SMS Controller"]:::controller
    end

    subgraph "Service Layer"
        ES["Email Service"]:::service
        SS["SMS Service"]:::service
    end

    subgraph "Provider Layer"
        subgraph "Email Providers"
            EPA["Provider A"]:::provider
            EPB["Provider B"]:::provider
            EPC["Provider C"]:::provider
        end
        
        subgraph "SMS Providers"
            SPA["Provider A"]:::provider
            SPB["Provider B"]:::provider
            SPC["Provider C"]:::provider
        end
    end

    subgraph "Task Management"
        TQ["Task Queue"]:::queue
        DLQ["Dead Letter Queue"]:::error
    end

    subgraph "Utilities"
        CB["Circuit Breaker"]:::utility
        RS["Retry Strategies"]:::utility
        RI["Retry Implementation"]:::utility
    end

    C --> ER & SR
    ER & SR --> VM
    VM --> EC & SC
    EC --> ES
    SC --> SS
    ES --> EPA
    SS --> SPA
    EPA -.-> EPB -.-> EPC
    SPA -.-> SPB -.-> SPC
    EPA & EPB & EPC & SPA & SPB & SPC --> CB
    CB --> RS
    RS --> RI
    RI --> TQ
    TQ --> DLQ

    %% Click Events
    click ER "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/routes/emailRoutes.ts"
    click SR "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/routes/smsRoutes.ts"
    click VM "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/middlewares/validateRequest.ts"
    click EC "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/controllers/emailController.ts"
    click SC "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/controllers/smsController.ts"
    click ES "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/services/emailService.ts"
    click SS "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/services/smsService.ts"
    click EPA "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/providers/email-providers/provider-a.ts"
    click EPB "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/providers/email-providers/provider-b.ts"
    click EPC "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/providers/email-providers/provider-c.ts"
    click SPA "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/providers/sms-providers/provider-a.ts"
    click SPB "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/providers/sms-providers/provider-b.ts"
    click SPC "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/providers/sms-providers/provider-c.ts"
    click TQ "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/tasks/taskQueue.ts"
    click DLQ "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/tasks/deadLetterQueue.ts"
    click CB "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/utils/circuitBreaker.ts"
    click RS "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/utils/retryStrategies.ts"
    click RI "https://github.com/shahnewaz-labib/notification-service-exp/blob/master/src/utils/sendWithRetry.ts"

    %% Styling
    classDef api fill:#87CEEB
    classDef middleware fill:#FFE4B5
    classDef controller fill:#98FB98
    classDef service fill:#DDA0DD
    classDef provider fill:#F0E68C
    classDef queue fill:#B8860B
    classDef error fill:#FF6347
    classDef utility fill:#87CEFA
```

### Run Instructions

```bash
yarn dev
```

### Stress test with vegeta

```bash
vegeta attack -targets=sms-targets.txt -rate=10 -duration=1s | vegeta report
```
