# mock notification service

### Run Instructions

```bash
yarn add express
yarn add dotenv -D
npx tsx server.ts
npx tsx client.ts
```

### Stress test with vegeta

```bash
vegeta attack -targets=targets.txt -rate=10 -duration=1s | vegeta report
```
