-- Add foreign key constraints for vehicles table
ALTER TABLE vehicles
    ADD CONSTRAINT fk_vehicles_vehicle_type_id 
    FOREIGN KEY (vehicle_type_id) 
    REFERENCES vehicle_types(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_vehicles_driver_id 
    FOREIGN KEY (driver_id) 
    REFERENCES users(id) ON DELETE RESTRICT;
