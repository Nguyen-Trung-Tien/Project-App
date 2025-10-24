import imgPro from "../assets/Product.jpg";

export const decodeImage = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return null;
  const uint8Array = new Uint8Array(bufferObj.data);
  return new TextDecoder().decode(uint8Array);
};

export const getImage = (image) => {
  if (!image) return imgPro;
  if (typeof image === "string") return image;
  if (image?.data && Array.isArray(image.data)) {
    try {
      const decoded = new TextDecoder().decode(new Uint8Array(image.data));
      if (decoded.startsWith("http")) return decoded;
      const base64String = btoa(
        new Uint8Array(image.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Error decoding image:", error);
      return imgPro;
    }
  }

  return imgPro;
};

export const getAvatarBase64 = (avatar) => {
  if (!avatar || !avatar.data) return "/default-avatar.png";

  const binary = new Uint8Array(avatar.data).reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );
  return `data:image/png;base64,${btoa(binary)}`;
};
