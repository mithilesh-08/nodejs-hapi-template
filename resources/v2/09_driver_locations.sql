create table driver_locations (
    id CHAR(36) primary key default (UUID()),
    driver_id CHAR(36) not null,
    location POINT NOT NULL,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    SPATIAL INDEX idx_driver_locations_location (location)
); 
