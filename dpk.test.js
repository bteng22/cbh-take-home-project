const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");
const {
  TRIVIAL_PARTITION_KEY,
  MAX_PARTITION_KEY_LENGTH,
} = require("./constants");

describe("deterministicPartitionKey", () => {
  let cryptoMock;
  let cryptoUpdateMock;
  let cryptoDigestMock;

  beforeEach(() => {
    cryptoUpdateMock = jest.fn().mockReturnThis();
    cryptoDigestMock = jest.fn();

    cryptoMock = jest.spyOn(crypto, "createHash").mockImplementation(() => ({
      update: cryptoUpdateMock,
      digest: cryptoDigestMock,
    }));
  });

  it("returns the trivial partition key '0' when given no input value", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe(TRIVIAL_PARTITION_KEY);
  });

  it("returns the trivial partition key '0' when given falsy values", () => {
    const falsyKey = deterministicPartitionKey(false);
    const zeroKey = deterministicPartitionKey(0);
    const emptyStringKey = deterministicPartitionKey("");

    expect(falsyKey).toBe(TRIVIAL_PARTITION_KEY);
    expect(zeroKey).toBe(TRIVIAL_PARTITION_KEY);
    expect(emptyStringKey).toBe(TRIVIAL_PARTITION_KEY);
  });

  it("returns an unhashed event's partition key", () => {
    const partitionKey = deterministicPartitionKey({
      partitionKey: "some-key",
    });

    expect(partitionKey).toBe("some-key");
  });

  it("stringifies an event's partition key if it is not a string", () => {
    const partitionKey = deterministicPartitionKey({
      partitionKey: { "not-a-string": true },
    });

    expect(partitionKey).toBe('{"not-a-string":true}');
  });

  it("returns a hex hash digest using SHA3-512 algorithm", () => {
    deterministicPartitionKey("foo");

    expect(cryptoMock).toBeCalledWith("sha3-512");
    expect(cryptoUpdateMock).toBeCalledWith('"foo"');
    expect(cryptoDigestMock).toBeCalledWith("hex");
  });

  it("hashes an event's partition key if length is greater than MAX_PARTITION_KEY_LENGTH", () => {
    cryptoDigestMock.mockReturnValueOnce("encrypted-foo");

    const partitionKey = deterministicPartitionKey({
      partitionKey: "a".repeat(MAX_PARTITION_KEY_LENGTH + 1),
    });

    expect(partitionKey).toBe("encrypted-foo");
  });

  it("hashes an event's partition key if stringified data is greater than MAX_PARTITION_KEY_LENGTH", () => {
    cryptoDigestMock.mockReturnValueOnce("encrypted-nested-foo");

    const partitionKey = deterministicPartitionKey({
      partitionKey: {
        "some-nested-data": "a".repeat(MAX_PARTITION_KEY_LENGTH + 1),
      },
    });

    expect(partitionKey).toBe("encrypted-nested-foo");
  });

  it("returns a hashed deterministic partition key from event data", () => {
    cryptoDigestMock.mockReturnValueOnce("happy-path-encrypted");

    const partitionKey = deterministicPartitionKey("data");

    expect(partitionKey).toBe("happy-path-encrypted");
  });
});
