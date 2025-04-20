function uint32ArrayToUint8Array(uint32Arr) {
  // If regular array provided, convert to Uint32Array first
  const uint32View = Array.isArray(uint32Arr)
    ? new Uint32Array(uint32Arr)
    : uint32Arr;

  // Create a Uint8Array with 4 bytes per uint32 value
  const uint8Arr = new Uint8Array(uint32View.length * 4);

  // Convert each uint32 to 4 bytes
  for (let i = 0; i < uint32View.length; i++) {
    const value = uint32View[i];
    const offset = i * 4;

    // Store bytes in little-endian format
    uint8Arr[offset] = value & 0xff;
    uint8Arr[offset + 1] = (value >> 8) & 0xff;
    uint8Arr[offset + 2] = (value >> 16) & 0xff;
    uint8Arr[offset + 3] = (value >> 24) & 0xff;
  }

  return uint8Arr;
}

function uint8ArrayToUint32Array(uint8Arr) {
  if (uint8Arr.length % 4 !== 0) {
    throw new Error("Input array length must be a multiple of 4");
  }

  const uint32Arr = new Uint32Array(uint8Arr.length / 4);

  for (let i = 0; i < uint8Arr.length; i += 4) {
    // Combine 4 bytes into one uint32 value (little-endian)
    uint32Arr[i / 4] =
      uint8Arr[i] |
      (uint8Arr[i + 1] << 8) |
      (uint8Arr[i + 2] << 16) |
      (uint8Arr[i + 3] << 24);
  }

  return uint32Arr;
}

export { uint32ArrayToUint8Array, uint8ArrayToUint32Array };
