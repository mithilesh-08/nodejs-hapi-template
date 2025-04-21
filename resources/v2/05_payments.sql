-- First create the table with all columns
create table if not exists payments (
    id CHAR(36) primary key default (UUID()),
    driver_id CHAR(36) not null,
    rider_id CHAR(36) not null,
    vehicle_id CHAR(36) not null,
    trip_id CHAR(36) not null,
    amount decimal(10,2) not null,
    payment_method varchar(50) not null,
    status enum('pending', 'completed', 'failed') not null,
    transaction_id varchar(255) default null UNIQUE,
    paid_at timestamp default null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    INDEX idx_payments_status (status),
    INDEX idx_payments_paid_at (paid_at),
    INDEX idx_payments_status_paid_at (status, paid_at)
);