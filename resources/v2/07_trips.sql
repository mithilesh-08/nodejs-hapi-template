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
    -- constraint fk_trips_driver_id foreign key (driver_id) references users(id),
    -- constraint fk_trips_rider_id foreign key (rider_id) references users(id),
    -- constraint fk_trips_vehicle_id foreign key (vehicle_id) references vehicles(id)
    INDEX idx_trips_driver_id (driver_id),
    INDEX idx_trips_rider_id (rider_id),
    INDEX idx_trips_vehicle_id (vehicle_id),
    INDEX idx_trips_status (status),
    INDEX idx_trips_start_time (start_time),
    INDEX idx_trips_end_time (end_time),
    SPATIAL INDEX idx_trips_pickup_location (pickup_location),
    SPATIAL INDEX idx_trips_dropoff_location (dropoff_location)
);


