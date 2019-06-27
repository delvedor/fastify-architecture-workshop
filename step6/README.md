# Step 6

Create an endpoint to index a new tweet.

Test with:

```
curl -X POST -H "Authorization: Basic am9uOnNub3c=" -H "Content-Type: application/json" http://localhost:3000/post -d '{"text":"hello"}'
```
