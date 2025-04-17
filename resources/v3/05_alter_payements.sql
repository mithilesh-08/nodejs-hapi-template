

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
