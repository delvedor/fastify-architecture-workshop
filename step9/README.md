# Step 8

Create an endpoint to get a new tweet.

Create a tweet with:

```
curl -X POST -H "Authorization: Basic am9uOnNub3c=" -H "Content-Type: application/json" http://localhost:3000/post -d '{"text":"hello"}'
```

Use that id in the next curl:

```
curl -H "Authorization: Basic am9uOnNub3c=" http://localhost:3030/post/$TWEETID
```
