// Bảng màu theo mệnh
const colorsByElement = {
  Kim: ["trắng", "xám", "vàng nhạt"],
  Thủy: ["xanh dương", "đen"],
  Mộc: ["xanh lá", "nâu nhạt"],
  Hỏa: ["đỏ", "cam", "hồng"],
  Thổ: ["vàng đất", "nâu", "cam nhạt"],
};

// Hàm tính mệnh theo năm sinh
const getElementByBirthYear = (year) => {
  const mod = year % 10;
  if ([0, 1].includes(mod)) return "Thổ";
  if ([2, 3].includes(mod)) return "Mộc";
  if ([4, 5].includes(mod)) return "Thủy";
  if ([6, 7].includes(mod)) return "Hỏa";
  if ([8, 9].includes(mod)) return "Kim";
};

const getLuckyColorsByYear = (year) => {
  const element = getElementByBirthYear(year);
  return colorsByElement[element] || [];
};
export { getElementByBirthYear, getLuckyColorsByYear, colorsByElement };
