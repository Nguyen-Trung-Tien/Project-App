const colorsByElement = {
  Kim: [
    "trắng",
    "xám",
    "xám đen",
    "ghi",
    "bạc",
    "vàng",
    "vàng kim",
    "vàng nhạt",
    "be sáng",
  ],
  Thủy: [
    "xanh dương",
    "đen",
    "xanh đen",
    "xanh navy",
    "xanh da trời nhạt",
    "xanh ngọc",
  ],
  Mộc: [
    "xanh lá",
    "xanh lá đậm",
    "xanh rêu",
    "nâu nhạt",
    "nâu gỗ",
    "xanh mint",
  ],
  Hỏa: ["đỏ", "đỏ đô", "cam", "hồng", "hồng đậm", "tím", "tím đỏ"],
  Thổ: ["vàng đất", "nâu", "nâu đậm", "cam nhạt", "be", "nâu sữa"],
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
