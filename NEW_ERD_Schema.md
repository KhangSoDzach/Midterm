# Database Schema - ERD với 2 bảng chính và 1 bảng phụ

## **Cấu trúc Database theo ERD**

### **1. Customer Table (Bảng Khách hàng)**
```javascript
{
  _id: ObjectId (MongoDB auto-generated)
  customer_id: String (unique, e.g., "CUST001")
  username: String (unique, for login)
  password: String (hashed)
  full_name: String
  phone_number: String
  email: String (unique)
  address: String
  available_balance: Number (số dư tài khoản)
  createdAt: Date
  updatedAt: Date
}
```

### **2. Tuition Table (Bảng Học phí)**
```javascript
{
  _id: ObjectId (MongoDB auto-generated)
  tuition_fee_id: String (unique, e.g., "TUI001")
  student_id: String (mã sinh viên)
  student_name: String (tên sinh viên)
  semester: String (học kỳ, e.g., "HK1", "HK2")
  academic_year: String (năm học, e.g., "2024-2025")
  tuition_amount: Number (số tiền học phí)
  due_date: Date (hạn đóng học phí)
  status: String (PAID, UNPAID, OVERDUE)
  createdAt: Date
  updatedAt: Date
}
```

### **3. Payment Table (Bảng phụ - Quan hệ nhiều-nhiều)**
```javascript
{
  _id: ObjectId (MongoDB auto-generated)
  payment_id: String (unique, e.g., "PAY20240920001")
  customer_id: String (references Customer.customer_id)
  tuition_fee_id: String (references Tuition.tuition_fee_id)
  payment_date: Date
  amount: Number
  status: String (PENDING, COMPLETED, FAILED, CANCELLED)
  payment_method: String (default: "ONLINE_BANKING")
  otp: String (6 digits, temporary)
  otp_expiry: Date (5 minutes from creation)
  transaction_reference: String
  createdAt: Date
  updatedAt: Date
}
```

## **Mối quan hệ**

- **Customer ←→ Tuition**: Quan hệ nhiều-nhiều thông qua bảng Payment
- **1 Customer** có thể thanh toán **nhiều Tuition** (của nhiều sinh viên khác nhau)
- **1 Tuition** có thể được thanh toán bởi **nhiều Customer** (phụ huynh, người thân)
- **Payment** là bảng trung gian lưu trữ:
  - Thông tin thanh toán
  - Trạng thái giao dịch
  - OTP verification
  - Ngày thanh toán

## **API Endpoints**

### **Authentication**
- `POST /api/login` - Đăng nhập Customer

### **Tuition Management**
- `GET /api/tuition/student/:studentId` - Lấy danh sách học phí của sinh viên
- `GET /api/tuition/:tuitionFeeId` - Lấy chi tiết một học phí

### **Payment Processing**
- `POST /api/payment/create` - Tạo giao dịch thanh toán (gửi OTP)
- `POST /api/otp/verify` - Xác thực OTP
- `POST /api/payment/complete` - Hoàn thành thanh toán

## **Dữ liệu mẫu**

### **Customers**
- CUST001: Administrator (Balance: 50,000,000 VND)
- CUST002: Nguyen Van A (Balance: 25,000,000 VND)  
- CUST003: Dang Bao Khang (Balance: 20,000,000 VND)

### **Tuition Fees**
- TUI001: 522H0003 - Dang Bao Khang - HK1 (15,000,000 VND)
- TUI002: 522H0028 - Le Nguyen Minh Kha - HK1 (12,000,000 VND)
- TUI003: 522H0020 - Hoang Van Minh - HK1 (18,000,000 VND)
- TUI004: 522H0003 - Dang Bao Khang - HK2 (16,000,000 VND)

### **Login Credentials**
- admin / admin123
- user1 / user123
- khang / khang123

## **Luồng thanh toán**

1. **Customer đăng nhập** → Nhận JWT token
2. **Tìm kiếm học phí** → GET /api/tuition/student/:studentId
3. **Tạo thanh toán** → POST /api/payment/create → Gửi OTP qua email
4. **Nhập OTP** → POST /api/otp/verify → Xác thực OTP
5. **Hoàn thành** → POST /api/payment/complete → Trừ tiền + Cập nhật trạng thái

## **Khởi tạo Database**

```bash
cd e:\Code\KTHDV\Mid\Midterm
node backend/scripts/initMongoDB.js
```