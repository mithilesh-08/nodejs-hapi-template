
-- Create new users table with desired structure
CREATE TABLE users (
    id CHAR(36) primary key default (UUID()),
    role_id CHAR(36),
    oauth_client_id INT(11) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    INDEX idx_users_phone_number (phone_number)
);


