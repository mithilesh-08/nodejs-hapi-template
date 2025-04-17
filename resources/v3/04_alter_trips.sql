
-- Add foreign key constraints for trips table
ALTER TABLE trips
    ADD CONSTRAINT fk_trips_driver_id 
    FOREIGN KEY (driver_id) 
    REFERENCES users(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_trips_rider_id 
    FOREIGN KEY (rider_id) 
    REFERENCES users(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_trips_vehicle_id 
    FOREIGN KEY (vehicle_id) 
    REFERENCES vehicles(id) ON DELETE RESTRICT;
