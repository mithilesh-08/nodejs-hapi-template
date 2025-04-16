-- Add foreign key constraints for role_permissions table
ALTER TABLE role_permissions
    ADD CONSTRAINT fk_role_permissions_role_id 
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_role_permissions_permission_id 
    FOREIGN KEY (permission_id) 
    REFERENCES permissions(id) ON DELETE CASCADE;

-- Add foreign key constraint for users table
ALTER TABLE users
    ADD CONSTRAINT fk_users_role_id 
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) ON DELETE SET NULL;

-- Add foreign key constraints for vehicles table
ALTER TABLE vehicles
    ADD CONSTRAINT fk_vehicles_vehicle_type_id 
    FOREIGN KEY (vehicle_type_id) 
    REFERENCES vehicle_types(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_vehicles_driver_id 
    FOREIGN KEY (driver_id) 
    REFERENCES users(id) ON DELETE RESTRICT;

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

-- Add foreign key constraints for payments table
ALTER TABLE payments
    ADD CONSTRAINT fk_payments_driver_id 
    FOREIGN KEY (driver_id) 
    REFERENCES users(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_payments_rider_id 
    FOREIGN KEY (rider_id) 
    REFERENCES users(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_payments_vehicle_id 
    FOREIGN KEY (vehicle_id) 
    REFERENCES vehicles(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_payments_trip_id 
    FOREIGN KEY (trip_id) 
    REFERENCES trips(id) ON DELETE RESTRICT;

-- Add foreign key constraint for ratings table
ALTER TABLE ratings
    ADD CONSTRAINT fk_ratings_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE;

-- Add foreign key constraint for trip_locations table
ALTER TABLE trip_locations
    ADD CONSTRAINT fk_trip_locations_trip_id 
    FOREIGN KEY (trip_id) 
    REFERENCES trips(id) ON DELETE CASCADE;

-- Add foreign key constraint for driver_locations table
ALTER TABLE driver_locations
    ADD CONSTRAINT fk_driver_locations_driver_id 
    FOREIGN KEY (driver_id) 
    REFERENCES users(id) ON DELETE CASCADE; 