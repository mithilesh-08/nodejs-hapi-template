CREATE TABLE role_permissions (
    id CHAR(36) primary key default (UUID()),
    role_id CHAR(36) NOT NULL,
    permission_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
