-- First create the vehicle_types table
create table vehicle_types (
    id CHAR(36) primary key default (UUID()),
    name varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint idx_vehicle_types_name unique (name)
);

-- Then create the vehicles table
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



-- Add foreign key constraints after both tables exist
-- ALTER TABLE vehicles
-- ADD CONSTRAINT fk_vehicles_vehicle_type_id 
-- FOREIGN KEY (vehicle_type_id) 
-- REFERENCES vehicle_types(id);

-- ALTER TABLE vehicles
-- ADD CONSTRAINT fk_vehicles_driver_id 
-- FOREIGN KEY (driver_id) 
-- REFERENCES users(id);