CREATE DATABASE ibanking_payment;
USE ibanking_payment;

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255),
    available_balance DECIMAL(18, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Students (
    student_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    tuition_amount DECIMAL(18, 2) NOT NULL
);

CREATE TABLE Transactions (
    transaction_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    transaction_date DATETIME DEFAULT GETDATE(),
    status VARCHAR(20) DEFAULT 'PENDING',
    otp VARCHAR(6),
    otp_expiry DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

CREATE TABLE Transaction_History (
    history_id INT IDENTITY(1,1) PRIMARY KEY,
    transaction_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(50),
    timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id)
);

DROP TABLE Users
DROP TABLE Students
DROP TABLE Transaction_History
DROP TABLE Transactions
