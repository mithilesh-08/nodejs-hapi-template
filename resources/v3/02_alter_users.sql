ALTER TABLE users
    ADD CONSTRAINT fk_users_role_id
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) ON DELETE SET NULL,
    ADD INDEX idx_users_phone_number (phone_number);

