<div align="center">
  <a href="https://github.com/Nguyen-Trung-Tien/Project-App">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnZnbjh5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5Y3I4Y2x5L2Vjb21tZXJjZS9naXBoeS5naWY/giphy.gif" alt="Logo" width="120" height="120">
  </a>

  <h1 align="center">?? TIEN_TECH Shop</h1>

  <p align="center">
    <strong>N?n t?ng Thuong m?i di?n t? Full-stack</strong>
    <br />
    Gi?i pháp mua s?m tr?c tuy?n hi?n d?i, b?o m?t và t?i uu tr?i nghi?m ngu?i dùng.
    <br />
    <br />
    <a href="https://github.com/Nguyen-Trung-Tien/Project-App"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">Xem Demo</a>
    ·
    <a href="https://github.com/Nguyen-Trung-Tien/Project-App/issues">Báo l?i</a>
    ·
    <a href="https://github.com/Nguyen-Trung-Tien/Project-App/issues">Yêu c?u tính nang</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/repo-size/Nguyen-Trung-Tien/Project-App?style=flat-square&color=orange" alt="Repo Size" />
    <img src="https://img.shields.io/github/issues/Nguyen-Trung-Tien/Project-App?style=flat-square&color=red" alt="Open Issues" />
    <img src="https://img.shields.io/github/last-commit/Nguyen-Trung-Tien/Project-App?style=flat-square&color=green" alt="Last Commit" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  </p>
</div>

---

## ?? M?c l?c

1. [Gi?i thi?u](#-gi?i-thi?u)
2. [Công ngh? s? d?ng](#-công-ngh?-s?-d?ng)
3. [Tính nang chính](#-tính-nang-chính)
4. [C?u trúc d? án](#-c?u-trúc-d?-án)
5. [Co s? d? li?u (ERD)](#-co-s?-d?-li?u-erd)
6. [Cài d?t & Tri?n khai](#-cài-d?t--tri?n-khai)
7. [API Reference](#-api-reference)
8. [Liên h?](#-liên-h?)

---

## ?? Gi?i thi?u

**TIEN_TECH Shop** là h? th?ng thuong m?i di?n t? hoàn ch?nh, mô ph?ng quy trình mua s?m t? phía khách hàng (Storefront) d?n qu?n tr? viên (Admin Dashboard).

D? án t?p trung vào:

- Xây d?ng **RESTful API** chu?n v?i Node.js/Express.
- Thi?t k? giao di?n **SPA** tuong tác cao b?ng ReactJS.
- Qu?n lý d? li?u quan h? v?i **MySQL & Sequelize**.
- Tri?n khai **Authentication & Authorization** an toàn.

---

## ?? Công ngh? s? d?ng

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

## ? Tính nang chính

Phân h? Khách hàng (Client)
- Authentication: dang ký, dang nh?p, logout, luu token.
- Smart Search: tìm ki?m s?n ph?m, g?i ý theo t? khóa.
- Shopping Cart: thêm, c?p nh?t s? lu?ng, xóa s?n ph?m.
- Checkout: d?t hàng, thanh toán COD.
- User Dashboard: xem l?ch s? don hàng, theo dõi tr?ng thái.

Phân h? Qu?n tr? (Admin)
- Secure Access: ch? admin truy c?p dashboard.
- Dashboard: th?ng kê doanh thu, don hàng m?i.
- Product Management: thêm, s?a, xóa s?n ph?m, upload ?nh.
- Category Management: qu?n lý danh m?c.
- Order Processing: duy?t và c?p nh?t tr?ng thái giao v?n.

---

## ?? C?u trúc d? án

```text
Project-App/
+-- BackEnd/
¦   +-- src/
¦       +-- config/         # DB, Env
¦       +-- controller/     # API handlers
¦       +-- middleware/     # Auth, Upload
¦       +-- migrations/     # Sequelize migrations
¦       +-- models/         # DB models
¦       +-- routers/        # API routes
¦       +-- services/       # Business logic
¦       +-- service.js      # Entry
+-- FrontEnd/
¦   +-- src/
¦       +-- api/            # API clients
¦       +-- assets/         # Images, SCSS
¦       +-- components/     # Reusable components
¦       +-- pages/          # Pages
¦       +-- redux/          # Slices & Store
¦       +-- styles/         # Global styles
¦       +-- main.jsx
+-- README.md
```

---

## ?? Co s? d? li?u (ERD)

Ðang c?p nh?t.

---

## ? Cài d?t & Tri?n khai

Yêu c?u
- Node.js >= 22
- MySQL Server

1. Clone d? án

```bash
git clone https://github.com/Nguyen-Trung-Tien/Project-App.git
cd Project-App
```

2. Cài d?t Backend

```bash
cd BackEnd
npm install

# T?o file .env và c?u hình:
# PORT=8080
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_password
# DB_NAME=ecommerce_db

npm start
```

Backend ch?y t?i `http://localhost:8080`

3. Cài d?t Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Frontend ch?y t?i `http://localhost:5173`

---

## ?? API Reference

```text
Method  Endpoint                      Mô t?
POST    /user/login                   Ðang nh?p ngu?i dùng
GET     /product/get-all-product      Danh sách s?n ph?m
GET     /product/get-product/:id      Chi ti?t s?n ph?m
GET     /product/search               Tìm ki?m s?n ph?m
GET     /product/discounted           S?n ph?m gi?m giá
POST    /order/create                 T?o don hàng
GET     /order/get-all-order          Danh sách don hàng
```

---

## ?? Liên h?

Tác gi?: Nguy?n Trung Ti?n
GitHub: @Nguyen-Trung-Tien
Email: trungtiennguyen910@gmail.com
