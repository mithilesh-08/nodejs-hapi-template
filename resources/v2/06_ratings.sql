create table ratings (
    id CHAR(36) primary key default (UUID()),
    user_id CHAR(36) not null,
    rating int not null,
    comment text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    -- constraint fk_ratings_user_id foreign key (user_id) references users(id)
    INDEX idx_ratings_user_id (user_id),
    INDEX idx_ratings_created_at (created_at)
);

-- Create indexes for common query patterns