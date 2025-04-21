ALTER TABLE users
    drop COLUMN first_name,
    drop COLUMN last_name,
    MODIFY COLUMN id CHAR(36) default (UUID()),
    ADD COLUMN name VARCHAR(255) NOT NULL,
    ADD COLUMN password VARCHAR(255),
    ADD COLUMN phone_number VARCHAR(20),
    ADD COLUMN updated_at timestamp default current_timestamp,
    INDEX idx_users_phone_number (phone_number);