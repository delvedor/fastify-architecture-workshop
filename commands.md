# Status

```sh
curl http://localhost:3000/status
```

# Get

```sh
curl http://localhost:3000/post/:id \
    -H 'Authorization: Basic YXJ5YTpzdGFyaw=='
```

# Post

```sh
curl http://localhost:3000/post \
  -X POST \
  -H 'Authorization: Basic YXJ5YTpzdGFyaw==' \
  -H 'Content-Type: application/json' \
  -d '{"text":"hello world"}'
```

# Timeline

```sh
curl http://localhost:3000/timeline?from=0 \
    -H 'Authorization: Basic YXJ5YTpzdGFyaw=='
```
