<div align="center">
  <a href="https://github.com/Nguyen-Trung-Tien/Project-App">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnZnbjh5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5L2Vjb21tZXJjZS9naXBoeS5naWY/giphy.gif" alt="Logo" width="120" height="120">
  </a>

  <h1 align="center">🛒 TIEN_TECH Shop</h1>

  <p align="center">
    <strong>Nền tảng Thương mại điện tử Full-stack</strong>
    <br />
    Giải pháp mua sắm trực tuyến hiện đại, bảo mật và tối ưu trải nghiệm người dùng.
    <br />
    <br />
    <a href="https://github.com/Nguyen-Trung-Tien/Project-App"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">Xem Demo</a>
    ·
    <a href="https://github.com/Nguyen-Trung-Tien/Project-App/issues">Báo lỗi</a>
    ·
    <a href="https://github.com/Nguyen-Trung-Tien/Project-App/issues">Yêu cầu tính năng</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/repo-size/Nguyen-Trung-Tien/Project-App?style=flat-square&color=orange" alt="Repo Size" />
    <img src="https://img.shields.io/github/issues/Nguyen-Trung-Tien/Project-App?style=flat-square&color=red" alt="Open Issues" />
    <img src="https://img.shields.io/github/last-commit/Nguyen-Trung-Tien/Project-App?style=flat-square&color=green" alt="Last Commit" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  </p>
</div>

---

## 📋 Mục lục

1. [Giới thiệu](#-giới-thiệu)
2. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
3. [Tính năng chính](#-tính-năng-chính)
4. [Cấu trúc dự án](#-cấu-trúc-dự-án)
5. [Cơ sở dữ liệu (ERD)](#-cơ-sở-dữ-liệu-erd)
6. [Cài đặt & Triển khai](#-cài-đặt--triển-khai)
7. [API Reference](#-api-reference)
8. [Liên hệ](#-liên-hệ)

---

## 🚀 Giới thiệu

**TIEN_TECH Shop** là hệ thống thương mại điện tử hoàn chỉnh, mô phỏng quy trình mua sắm từ phía khách hàng (Storefront) đến quản trị viên (Admin Dashboard).

Dự án tập trung vào:

- Xây dựng **RESTful API** chuẩn với Node.js/Express.
- Thiết kế giao diện **SPA** tương tác cao bằng ReactJS.
- Quản lý dữ liệu quan hệ với **MySQL & Sequelize**.
- Triển khai **Authentication & Authorization** an toàn.

---

## 🛠 Công nghệ sử dụng

### Frontend (Client)

- ![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB) **ReactJS (Vite)**
- ![Redux](https://img.shields.io/badge/Redux-593d88?style=flat-square&logo=redux&logoColor=white) **Redux Toolkit**
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat-square&logo=bootstrap&logoColor=white) **Bootstrap 5 / SCSS**
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) **Axios**

### Backend (Server)

- ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) **Node.js**
- ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=61DAFB) **Express**
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white) **JWT**
- ![Multer](https://img.shields.io/badge/Multer-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **Multer**

### Database & Tools

- ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white) **MySQL**
- ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white) **Sequelize ORM**
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white) **Postman**

---

## ✨ Tính năng chính

Phân hệ Khách hàng (Client)
- Authentication: đăng ký, đăng nhập, logout, lưu token.
- Smart Search: tìm kiếm sản phẩm, gợi ý theo từ khóa.
- Shopping Cart: thêm, cập nhật số lượng, xóa sản phẩm.
- Checkout: đặt hàng, thanh toán COD.
- User Dashboard: xem lịch sử đơn hàng, theo dõi trạng thái.

Phân hệ Quản trị (Admin)
- Secure Access: chỉ admin truy cập dashboard.
- Dashboard: thống kê doanh thu, đơn hàng mới.
- Product Management: thêm, sửa, xóa sản phẩm, upload ảnh.
- Category Management: quản lý danh mục.
- Order Processing: duyệt và cập nhật trạng thái giao vận.

---

## 📂 Cấu trúc dự án

```text
Project-App/
├── BackEnd/
│   └── src/
│       ├── config/         # DB, Env
│       ├── controller/     # API handlers
│       ├── middleware/     # Auth, Upload
│       ├── migrations/     # Sequelize migrations
│       ├── models/         # DB models
│       ├── routers/        # API routes
│       ├── services/       # Business logic
│       └── service.js      # Entry
├── FrontEnd/
│   └── src/
│       ├── api/            # API clients
│       ├── assets/         # Images, SCSS
│       ├── components/     # Reusable components
│       ├── pages/          # Pages
│       ├── redux/          # Slices & Store
│       ├── styles/         # Global styles
│       └── main.jsx
└── README.md
```

---

## 🗄 Cơ sở dữ liệu (ERD)
<img width="3494" height="4270" alt="Untitled diagram-2026-02-09-070005" src="https://github.com/user-attachments/assets/458ef7a0-d078-48a6-9ec2-8b9b6de5abda" />

---

## ⚡ Cài đặt & Triển khai

Yêu cầu
- Node.js >= 22
- MySQL Server

1. Clone dự án

```bash
git clone https://github.com/Nguyen-Trung-Tien/Project-App.git
cd Project-App
```

2. Cài đặt Backend

```bash
cd BackEnd
npm install

# Tạo file .env và cấu hình:
# PORT=8080
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_password
# DB_NAME=ecommerce_db

npm start
```

Backend chạy tại `http://localhost:8080`

3. Cài đặt Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`

---

## 🔌 API Reference

```text
Method  Endpoint                      Mô tả
POST    /user/login                   Đăng nhập người dùng
GET     /product/get-all-product      Danh sách sản phẩm
GET     /product/get-product/:id      Chi tiết sản phẩm
GET     /product/search               Tìm kiếm sản phẩm
GET     /product/discounted           Sản phẩm giảm giá
POST    /order/create                 Tạo đơn hàng
GET     /order/get-all-order          Danh sách đơn hàng
```

---

## 📞 Liên hệ

Tác giả: Nguyễn Trung Tiến
GitHub: @Nguyen-Trung-Tien
Email: trungtiennguyen910@gmail.com
