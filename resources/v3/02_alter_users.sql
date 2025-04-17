-- Add foreign key constraint for users table
ALTER TABLE users
    ADD CONSTRAINT users_oauth_clients_id_fk 
    FOREIGN KEY (oauth_client_id)
    REFERENCES oauth_clients(id) ON UPDATE CASCADE,
    ADD CONSTRAINT fk_users_role_id 
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) ON DELETE SET NULL;
