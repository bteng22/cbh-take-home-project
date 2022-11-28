# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

Copying previous implementation below so I can easily refer to line numbers in my explanation below.

```
exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  if (candidate) {
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};
```

## Your Explanation Here

The biggest culprit to dpk.js is the `candidate` variable on line 17. Tracking it's lifecycle throughout the function is complicated and prone to errors since it could be mutated various times throughout the code (lines 21, 24, 30, 33, 36). I attempted to simplify this into 3 branches of logic:

1. When an event is not supplied or is falsy
2. When an event object with a partitionKey is provided
3. All other cases.

These three branches provide a more deterministic flow between the `event` input and the partition key output. It removes the `candidate` variable and has clearer exits. It also provides a clear context boundary if the partitionKey logic becomes more complex and we have to extract it into a separate function.
