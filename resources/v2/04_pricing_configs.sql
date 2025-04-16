create table pricing_configs (
    id CHAR(36) primary key default (UUID()),
    base_fare decimal(10, 2) not null,
    per_km_rate decimal(10, 2) not null,
    per_minute_rate decimal(10, 2) not null,
    booking_fee decimal(10, 2) not null,
    surcharge_multiplier decimal(10, 2) not null,
    effective_from timestamp not null,
    effective_to timestamp not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);
