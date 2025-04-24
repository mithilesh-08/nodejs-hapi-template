create table roles (
    id CHAR(36) primary key default (UUID()),
    name varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint idx_roles_name unique (name)
);


