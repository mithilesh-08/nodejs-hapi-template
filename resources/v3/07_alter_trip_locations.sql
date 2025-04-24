-- Add foreign key constraint for trip_locations table
ALTER TABLE trip_locations
    ADD CONSTRAINT fk_trip_locations_trip_id 
    FOREIGN KEY (trip_id) 
    REFERENCES trips(id) ON DELETE CASCADE;
