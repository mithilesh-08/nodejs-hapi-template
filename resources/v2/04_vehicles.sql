create table vehicles (
    id CHAR(36) primary key default (UUID()),
    name varchar(255) not null,
    vehicle_type_id CHAR(36) not null,
    driver_id CHAR(36) not null,
    license_plate varchar(20) not null,
    color varchar(50),
    year int,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint idx_vehicles_license_plate unique (license_plate)
);
