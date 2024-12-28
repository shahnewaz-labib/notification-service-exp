# mock notification service

### Run Instructions

```bash
yarn dev
```

### Stress test with vegeta

```bash
vegeta attack -targets=targets.txt -rate=10 -duration=1s | vegeta report
```
