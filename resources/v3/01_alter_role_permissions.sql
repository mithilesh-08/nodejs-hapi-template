-- Add foreign key constraints for role_permissions table
ALTER TABLE role_permissions
    ADD CONSTRAINT fk_role_permissions_role_id 
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_role_permissions_permission_id 
    FOREIGN KEY (permission_id) 
    REFERENCES permissions(id) ON DELETE CASCADE;
