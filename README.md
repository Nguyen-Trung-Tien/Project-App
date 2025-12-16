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
3. [Cấu trúc dự án](#-cấu-trúc-dự-án)
4. [Cơ sở dữ liệu (ERD)](#-cơ-sở-dữ-liệu-erd)
5. [Tính năng chính](#-tính-năng-chính)
6. [Hình ảnh Demo](#-hình-ảnh-demo)
7. [Cài đặt & Triển khai](#-cài-đặt--triển-khai)
8. [API Reference](#-api-reference)
9. [Liên hệ](#-liên-hệ)

---

## 🚀 Giới thiệu

**TIEN_TECH Shop** là một hệ thống thương mại điện tử hoàn chỉnh (E-commerce Full-stack), được thiết kế để mô phỏng quy trình kinh doanh thực tế từ phía Khách hàng (Storefront) đến Quản trị viên (Admin Dashboard).

Dự án minh chứng cho khả năng:

- Xây dựng **RESTful API** chuẩn mực với Node.js/Express.
- Thiết kế giao diện **SPA** tương tác cao với ReactJS.
- Quản lý dữ liệu quan hệ phức tạp với **MySQL & Sequelize**.
- Triển khai quy trình **Authentication & Authorization** bảo mật.

---

## 🛠 Công nghệ sử dụng

### Frontend (Client)

- ![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB) **ReactJS (Vite):** Xây dựng giao diện người dùng.
- ![Redux](https://img.shields.io/badge/Redux-593d88?style=flat-square&logo=redux&logoColor=white) **Redux Toolkit:** Quản lý Global State (Cart, Auth).
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat-square&logo=bootstrap&logoColor=white) **Bootstrap 5 / SCSS:** Responsive Design.
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) **Axios:** Xử lý HTTP Requests.

### Backend (Server)

- ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) **Node.js:** Javascript Runtime.
- ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=61DAFB) **Express:** Framework API mạnh mẽ.
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white) **JWT:** Xác thực an toàn.
- ![Multer](https://img.shields.io/badge/Multer-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **Multer:** Upload hình ảnh sản phẩm.

### Database & Tools

- ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white) **MySQL:** Hệ quản trị CSDL.
- ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white) **Sequelize ORM:** Tương tác CSDL.
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white) **Postman:** Testing API.

---

## 📂 Cấu trúc dự án

Mô hình tổ chức thư mục rõ ràng, tách biệt giữa Backend và Frontend:

```text
PROJECT-APP/
├── backend/
│   ├── src/
│   │   ├── config/         # Cấu hình DB, Env
│   │   ├── controllers/    # Logic xử lý nghiệp vụ
│   │   ├── migrations/     # Sequelize migrations
│   │   ├── models/         # Định nghĩa Schema DB
│   │   ├── routes/         # Định nghĩa API Endpoints
│   │   ├── middleware/     # Auth, Upload middleware
│   │   └── server.js       # Entry point
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── assets/         # Hình ảnh, SCSS
│   │   ├── components/     # Reusable Components
│   │   ├── pages/          # Các màn hình chính
│   │   ├── redux/          # Redux Slices & Store
│   │   ├── services/       # API Services (Axios)
│   │   └── App.js
│   └── ...
└── README.md
```

Để làm cho README trở nên "xịn sò", chuyên nghiệp và ấn tượng hơn với nhà tuyển dụng, mình sẽ bổ sung thêm các yếu tố sau:

Biểu đồ Cấu trúc dự án (Project Structure): Để họ thấy bạn biết cách tổ chức code.

Sơ đồ quan hệ thực thể (ERD) bằng Mermaid.js: GitHub hỗ trợ hiển thị sơ đồ trực tiếp, nhìn rất kỹ thuật.

Bảng API Endpoints: Thể hiện bạn biết cách viết tài liệu cho Backend.

Các Badges trạng thái: Thêm các huy hiệu về size của repo, ngôn ngữ,...

Dưới đây là phiên bản nâng cấp toàn diện. Bạn hãy Copy toàn bộ và dán vào file README.md.

Markdown

<div align="center">
  <a href="https://github.com/Nguyen-Trung-Tien/Project-App">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnZnbjh5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5L2Vjb21tZXJjZS9naXBoeS5naWY/giphy.gif" alt="Logo" width="120" height="120">
  </a>

  <h1 align="center">🛒 TIEN_TECH Shop</h1>

  <p align="center">
    <strong>Nền tảng Thương mại điện tử Full-stack (PERN/MERN Stack)</strong>
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
3. [Cấu trúc dự án](#-cấu-trúc-dự-án)
4. [Cơ sở dữ liệu (ERD)](#-cơ-sở-dữ-liệu-erd)
5. [Tính năng chính](#-tính-năng-chính)
6. [Hình ảnh Demo](#-hình-ảnh-demo)
7. [Cài đặt & Triển khai](#-cài-đặt--triển-khai)
8. [API Reference](#-api-reference)
9. [Liên hệ](#-liên-hệ)

---

## 🚀 Giới thiệu

**TIEN_TECH Shop** là một hệ thống thương mại điện tử hoàn chỉnh (E-commerce Full-stack), được thiết kế để mô phỏng quy trình kinh doanh thực tế từ phía Khách hàng (Storefront) đến Quản trị viên (Admin Dashboard).

Dự án minh chứng cho khả năng:

- Xây dựng **RESTful API** chuẩn mực với Node.js/Express.
- Thiết kế giao diện **SPA** tương tác cao với ReactJS.
- Quản lý dữ liệu quan hệ phức tạp với **MySQL & Sequelize**.
- Triển khai quy trình **Authentication & Authorization** bảo mật.

---

## 🛠 Công nghệ sử dụng

### Frontend (Client)

- ![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB) **ReactJS (Vite):** Xây dựng giao diện người dùng.
- ![Redux](https://img.shields.io/badge/Redux-593d88?style=flat-square&logo=redux&logoColor=white) **Redux Toolkit:** Quản lý Global State (Cart, Auth).
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat-square&logo=bootstrap&logoColor=white) **Bootstrap 5 / SCSS:** Responsive Design.
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) **Axios:** Xử lý HTTP Requests.

### Backend (Server)

- ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) **Node.js:** Javascript Runtime.
- ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=61DAFB) **Express:** Framework API mạnh mẽ.
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white) **JWT:** Xác thực an toàn.
- ![Multer](https://img.shields.io/badge/Multer-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **Multer:** Upload hình ảnh sản phẩm.

### Database & Tools

- ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white) **MySQL:** Hệ quản trị CSDL.
- ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white) **Sequelize ORM:** Tương tác CSDL.
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white) **Postman:** Testing API.

---

## 📂 Cấu trúc dự án

Mô hình tổ chức thư mục rõ ràng, tách biệt giữa Backend và Frontend:

```text
PROJECT-APP/
├── backend/
│   ├── src/
│   │   ├── config/         # Cấu hình DB, Env
│   │   ├── controllers/    # Logic xử lý nghiệp vụ
│   │   ├── migrations/     # Sequelize migrations
│   │   ├── models/         # Định nghĩa Schema DB
│   │   ├── routes/         # Định nghĩa API Endpoints
│   │   ├── middleware/     # Auth, Upload middleware
│   │   └── server.js       # Entry point
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── assets/         # Hình ảnh, SCSS
│   │   ├── components/     # Reusable Components
│   │   ├── pages/          # Các màn hình chính
│   │   ├── redux/          # Redux Slices & Store
│   │   ├── services/       # API Services (Axios)
│   │   └── App.js
│   └── ...
└── README.md
```

🗄 Cơ sở dữ liệu (ERD)

```
erDiagram
    USERS ||--o{ ORDERS : "places"
    USERS {
        int id PK
        string email
        string password
        string role "Admin/User"
    }
    CATEGories ||--|{ PRODUCTS : "contains"
    CATEGories {
        int id PK
        string name
        int parent_id
    }
    PRODUCTS ||--o{ ORDER_DETAILS : "is_in"
    PRODUCTS {
        int id PK
        string name
        float price
        string image
        int stock
    }
    ORDERS ||--|{ ORDER_DETAILS : "has"
    ORDERS {
        int id PK
        int user_id FK
        string status "Pending/Shipped"
        float total_price
    }
    ORDER_DETAILS {
        int order_id FK
        int product_id FK
        int quantity
        float price
    }
```

✨ Tính năng chính
Phân hệ Khách hàng (Client)
Authentication: Đăng ký/Đăng nhập/Logout (Lưu Token LocalStorage).
Smart Search: Tìm kiếm sản phẩm theo tên, lọc theo danh mục.
Shopping Cart: Thêm vào giỏ, cập nhật số lượng, xóa sản phẩm (Real-time UI).
Checkout: Đặt hàng với thông tin giao nhận, thanh toán COD.
User Dashboard: Xem lịch sử đơn hàng, theo dõi trạng thái xử lý.

🛠 Phân hệ Quản trị (Admin)
🛡 Secure Access: Chỉ Admin mới có quyền truy cập.
📊 Dashboard: Thống kê tổng quan doanh thu, đơn hàng mới.
📦 Product Management: Thêm/Sửa/Xóa sản phẩm, upload ảnh minh họa.
🗂 Category Management: Quản lý cây danh mục đa cấp.
🚚 Order Processing: Duyệt đơn hàng, chuyển trạng thái giao vận.
⚡ Cài đặt & Triển khai
Làm theo các bước sau để chạy dự án trên máy cục bộ:

Yêu cầu
Node.js >= v22

MySQL Server

1. Clone dự án

```
git clone [https://github.com/Nguyen-Trung-Tien/Project-App.git](https://github.com/Nguyen-Trung-Tien/Project-App.git)
cd Project-App
```

2. Cài đặt Backend

```
cd backend
npm install

# Tạo file .env và cấu hình:
# PORT=8080
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_password
# DB_NAME=ecommerce_db

# Chạy migration (nếu có) & Start Server
npm start
```

Backend chạy tại: http://localhost:8080 3. Cài đặt Frontend

```
# Mở terminal mới
cd frontend
npm install
npm start
```

Frontend chạy tại: http://localhost:5173
🔌 API Reference

```
Một số API Endpoint chính của hệ thống:
Method,Endpoint,Mô tả,Auth
POST,/api/auth/login,Đăng nhập người dùng
GET,/api/products,Lấy danh sách sản phẩm
GET,/api/products/:id,Lấy chi tiết sản phẩm
POST,/api/orders,Tạo đơn hàng mới
GET,/api/orders/my-orders,Lịch sử đơn hàng cá nhân
POST,/api/admin/products,Thêm sản phẩm mới,Admin
PUT,/api/admin/orders/:id,Cập nhật trạng thái đơn,Admin
```

📞 Liên hệ
Tác giả: Nguyễn Trung Tiến

GitHub:[ @Nguyen-Trung-Tien](https://github.com/Nguyen-Trung-Tien)

Email: trungtiennguyen910@gmail.com
