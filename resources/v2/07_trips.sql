create table trips (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    driver_id CHAR(36) NOT NULL,
    rider_id CHAR(36) NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    pickup_location POINT NOT NULL,
    dropoff_location POINT NOT NULL,
    distance decimal(10,2) not null,
    start_time timestamp not null,
    end_time timestamp not null,
    duration int not null,
    fare decimal(10,2) not null,
    status varchar(20) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    INDEX idx_trips_status (status),
    INDEX idx_trips_start_time (start_time),
    INDEX idx_trips_end_time (end_time),
    SPATIAL INDEX idx_trips_pickup_location (pickup_location),
    SPATIAL INDEX idx_trips_dropoff_location (dropoff_location)
);


