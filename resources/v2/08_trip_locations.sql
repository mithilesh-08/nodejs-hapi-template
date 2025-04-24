create table trip_locations (
    id CHAR(36) primary key default (UUID()),
    trip_id CHAR(36) not null,
    location POINT NOT NULL,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    SPATIAL INDEX idx_trip_locations_location (location)
);
