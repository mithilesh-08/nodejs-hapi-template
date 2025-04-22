create table ratings (
    id CHAR(36) primary key default (UUID()),
    user_id CHAR(36) not null,
    rating int not null,
    comment text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    INDEX idx_ratings_created_at (created_at)
);
