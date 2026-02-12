🧵 **Thread: The Push Notification Library I Wish I Had**

1/8
I'm tired of rewriting push notification logic for every Node.js project.
Rate limits? Retries? Queues? FCM vs Expo?
It's too much boilerplate. 😫

So I built `jxpush`. 🚀
A production-grade, unified push engine for Node.js.

👇

2/8
📦 **Unified API**
Stop wrestling with different SDKs.
Switch between FCM and Expo with one line of config.
The API remains exactly the same. type-safe and clean.

3/8
🚦 **Rate Limiting & Concurrency**
Don't get banned.
`jxpush` implements a Token Bucket algorithm to throttle requests automatically.
Plus, a concurrent queue system to handle traffic spikes.

4/8
🔄 **Smart Retries**
Network failed? Service down?
We handle exponential backoff with jitter automatically.
Your messages get delivered, even when the internet hiccups.

5/8
⚡ **Bulk Sending**
Need to message 100k users?
Just pass the array.
We auto-chunk it into batches of 500 (FCM) or 100 (Expo) for max throughput.

6/8
🔍 **Observability**
Hooks for everything.
`onSendSuccess`, `onRateLimit`, `onRetry`.
Plug in your logger or metrics service easily.

7/8
💻 **Try it out**
`npm install jxpush`

Built with ❤️ and 100% TypeScript.

8/8
🔗 **Links**
GitHub: https://github.com/jxngrx/jxpush
NPM: https://www.npmjs.com/package/jxpush

RTs appreciated! #nodejs #typescript #mobiledev #opensource
