-- Drop the existing table
DROP TABLE IF EXISTS users;

-- Create new users table with desired structure
CREATE TABLE users (
        id CHAR(36) primary key default (UUID()),
    role_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    INDEX idx_users_phone_number (phone_number)
);



-- Add foreign key constraint if it doesn't exist
-- ALTER TABLE users
--     ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

-- Add index on phone_number if it doesn't exist

-- Update existing rows with UUID if needed
