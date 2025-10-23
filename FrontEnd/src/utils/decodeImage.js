const decodeImage = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return null;
  const uint8Array = new Uint8Array(bufferObj.data);
  return new TextDecoder().decode(uint8Array);
};
export default { decodeImage };
