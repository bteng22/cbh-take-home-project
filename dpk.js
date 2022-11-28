const crypto = require("crypto");
const {
  TRIVIAL_PARTITION_KEY,
  MAX_PARTITION_KEY_LENGTH,
} = require("./constants");

const deterministicPartitionKey = (event) => {
  const Hash = crypto.createHash("sha3-512");

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (event.partitionKey) {
    let { partitionKey } = event;

    if (typeof partitionKey !== "string") {
      partitionKey = JSON.stringify(partitionKey);
    }
    if (partitionKey.length > MAX_PARTITION_KEY_LENGTH) {
      return Hash.update(partitionKey).digest("hex");
    }

    return partitionKey;
  }

  const data = JSON.stringify(event);
  return Hash.update(data).digest("hex");
};

module.exports = {
  deterministicPartitionKey,
};
