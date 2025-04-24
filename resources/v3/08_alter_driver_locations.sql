
-- Add foreign key constraint for driver_locations table
ALTER TABLE driver_locations
    ADD CONSTRAINT fk_driver_locations_driver_id 
    FOREIGN KEY (driver_id) 
    REFERENCES users(id) ON DELETE CASCADE; 