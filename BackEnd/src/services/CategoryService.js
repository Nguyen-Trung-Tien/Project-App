const db = require("../models");

const getAllCategories = async () => {
  try {
    const categories = await db.Category.findAll({
      attributes: ["id", "name", "slug", "description", "image", "createdAt"],
      order: [["id", "ASC"]],
    });

    // 🔄 Chuyển BLOB image sang base64 để frontend hiển thị được
    const formatted = categories.map((cat) => {
      let imageBase64 = null;
      if (cat.image) {
        imageBase64 = Buffer.from(cat.image).toString("base64");
      }
      return { ...cat.toJSON(), image: imageBase64 };
    });

    return { errCode: 0, data: formatted };
  } catch (error) {
    console.error("CategoryService getAllCategories error:", error);
    return { errCode: 1, errMessage: "Lỗi khi lấy danh sách danh mục" };
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await db.Category.findByPk(id);
    if (!category)
      return { errCode: 1, errMessage: "Không tìm thấy danh mục này" };

    let imageBase64 = null;
    if (category.image) {
      imageBase64 = Buffer.from(category.image).toString("base64");
    }

    return { errCode: 0, data: { ...category.toJSON(), image: imageBase64 } };
  } catch (error) {
    console.error("CategoryService getCategoryById error:", error);
    return { errCode: 1, errMessage: "Lỗi khi lấy danh mục" };
  }
};

const createCategory = async (data) => {
  try {
    const { name, slug, description, image } = data;

    const exist = await db.Category.findOne({ where: { name } });
    if (exist) return { errCode: 2, errMessage: "Tên danh mục đã tồn tại" };

    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    await db.Category.create({
      name,
      slug,
      description,
      image: imageBuffer,
    });

    return { errCode: 0, message: "Tạo danh mục thành công" };
  } catch (error) {
    console.error("CategoryService createCategory error:", error);
    return { errCode: 1, errMessage: "Lỗi khi tạo danh mục" };
  }
};

const updateCategory = async (id, data) => {
  try {
    const category = await db.Category.findByPk(id);
    if (!category) return { errCode: 1, errMessage: "Không tìm thấy danh mục" };

    const { name, slug, description, image } = data;
    const imageBuffer = image ? Buffer.from(image, "base64") : category.image;

    await category.update({ name, slug, description, image: imageBuffer });
    return { errCode: 0, message: "Cập nhật thành công" };
  } catch (error) {
    console.error("CategoryService updateCategory error:", error);
    return { errCode: 1, errMessage: "Lỗi khi cập nhật danh mục" };
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await db.Category.findByPk(id);
    if (!category) return { errCode: 1, errMessage: "Không tìm thấy danh mục" };

    await category.destroy();
    return { errCode: 0, message: "Xóa thành công" };
  } catch (error) {
    console.error("CategoryService deleteCategory error:", error);
    return { errCode: 1, errMessage: "Lỗi khi xóa danh mục" };
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
