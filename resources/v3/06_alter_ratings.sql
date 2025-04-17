
-- Add foreign key constraint for ratings table
ALTER TABLE ratings
    ADD CONSTRAINT fk_ratings_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE;
