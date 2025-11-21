<div align="center">
  <a href="https://github.com/username/repo-name">
    <img src="https://media.giphy.com/media/YourGifOrLogoLinkHere/giphy.gif" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">🛒TIEN_TECH Shop</h1>

  <p align="center">
    Hệ thống thương mại điện tử Full-stack hiện đại, mạnh mẽ và thân thiện.
    <br />
    <a href="https://github.com/username/repo-name"><strong>Khám phá tài liệu »</strong></a>
    <br />
    <br />
    <a href="https://your-demo-link.com">Xem Demo</a>
    ·
    <a href="https://github.com/username/repo-name/issues">Báo lỗi</a>
    ·
    <a href="https://github.com/username/repo-name/issues">Yêu cầu tính năng</a>
  </p>
</div>

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

</div>

---

## 📋 Mục lục

1. [Giới thiệu](#-giới-thiệu)
2. [Tính năng chính](#-tính-năng-chính)
3. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
4. [Hình ảnh Demo](#-hình-ảnh-demo)
5. [Cài đặt & Hướng dẫn sử dụng](#-cài-đặt--hướng-dẫn-sử-dụng)
6. [Cấu trúc cơ sở dữ liệu](#-cấu-trúc-cơ-sở-dữ-liệu)
7. [Đóng góp](#-đóng-góp)
8. [Liên hệ](#-liên-hệ)

---

## 🚀 Giới thiệu

Dự án **E-Commerce Platform** là một giải pháp bán hàng trực tuyến hoàn chỉnh, được xây dựng để mô phỏng quy trình kinh doanh thực tế. Hệ thống bao gồm giao diện mua sắm dành cho khách hàng (Client) và trang quản trị dành cho Admin (CMS).

Dự án này được phát triển nhằm mục đích áp dụng các kiến thức về **ReactJS** (Frontend) và **Node.js/Express** (Backend), cùng với việc quản lý cơ sở dữ liệu quan hệ **MySQL**.

---

## ✨ Tính năng chính

### 👤 Dành cho Khách hàng (User)
- [x] **Xác thực:** Đăng ký, Đăng nhập, Quên mật khẩu (JWT Authentication).
- [x] **Duyệt sản phẩm:** Xem danh sách, lọc theo danh mục, tìm kiếm thông minh.
- [x] **Chi tiết sản phẩm:** Xem ảnh, mô tả, giá và số lượng tồn kho.
- [x] **Giỏ hàng:** Thêm/Sửa/Xóa sản phẩm, tính tổng tiền tự động (Redux).
- [x] **Thanh toán:** Quy trình đặt hàng, nhập địa chỉ và xác nhận (COD).
- [x] **Lịch sử đơn hàng:** Theo dõi trạng thái đơn hàng (Pending -> Delivered).

### 🛠 Dành cho Quản trị viên (Admin)
- [x] **Dashboard:** Thống kê doanh thu, số lượng đơn hàng, biểu đồ tăng trưởng.
- [x] **Quản lý Sản phẩm:** CRUD (Thêm, Sửa, Xóa), upload hình ảnh.
- [x] **Quản lý Danh mục:** Tổ chức danh mục sản phẩm.
- [x] **Quản lý Đơn hàng:** Duyệt đơn, cập nhật trạng thái vận chuyển.
- [x] **Quản lý Người dùng:** Xem danh sách khách hàng, phân quyền.

---

## 🛠 Công nghệ sử dụng

| Phần | Công nghệ | Mô tả |
| :--- | :--- | :--- |
| **Frontend** | ReactJS | Thư viện xây dựng giao diện người dùng (SPA) |
| | Redux Toolkit | Quản lý trạng thái (State Management) |
| | React Router | Điều hướng trang |
| | Bootstrap 5 / SCSS | Framework CSS Responsive |
| | Axios | Xử lý HTTP Requests |
| **Backend** | Node.js | Runtime môi trường JavaScript |
| | Express.js | Framework xây dựng RESTful API |
| | Sequelize | ORM làm việc với MySQL |
| | JSON Web Token | Xác thực và bảo mật API |
| | Multer | Xử lý upload file/hình ảnh |
| **Database** | MySQL | Hệ quản trị cơ sở dữ liệu quan hệ |

---

## 📸 Hình ảnh Demo

### 1. Trang chủ & Danh sách sản phẩm
![Home Page](https://via.placeholder.com/800x400?text=Hinh+Anh+Trang+Chu)
*Giao diện trang chủ với danh sách sản phẩm và banner*

### 2. Giỏ hàng & Thanh toán
![Cart Page](https://via.placeholder.com/800x400?text=Hinh+Anh+Gio+Hang)
*Giao diện giỏ hàng và quy trình thanh toán*

### 3. Trang Quản trị (Admin Dashboard)
![Admin Dashboard](https://via.placeholder.com/800x400?text=Hinh+Anh+Admin)
*Giao diện Dashboard quản lý doanh thu và đơn hàng*

---

## ⚡ Cài đặt & Hướng dẫn sử dụng

Để chạy dự án này trên máy cá nhân (Localhost), hãy làm theo các bước sau:

### Yêu cầu tiên quyết
* Node.js (v14 trở lên)
* MySQL (đã cài đặt và đang chạy)

### Bước 1: Clone dự án

```bash
git clone https://github.com/Nguyen-Trung-Tien/Project-App.git

````
Bước 2: Cài đặt Backend (Server)
```bash
cd backend
npm install
```
Cấu hình biến môi trường (.env): Tạo file .env trong thư mục backend và điền thông tin:
```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=ecommerce_db
JWT_SECRET=your_secret_key
```
Chạy Server:
```bash
npm start
# Server sẽ chạy tại http://localhost:8080
```
Bước 3: Cài đặt Frontend (Client)
Mở một terminal mới:
```bash
cd frontend
npm install
npm start
# Ứng dụng sẽ chạy tại http://localhost:5173
```
💾 Cấu trúc Cơ sở dữ liệu
Hệ thống sử dụng MySQL với các bảng chính:

Users: Lưu trữ thông tin người dùng và Admin.

Products: Lưu trữ thông tin sản phẩm.

Categories: Danh mục sản phẩm.

Orders: Thông tin đơn hàng.

Order_Details: Chi tiết sản phẩm trong đơn hàng.

