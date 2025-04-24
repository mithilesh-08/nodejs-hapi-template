ALTER TABLE trips
    MODIFY COLUMN end_time DATETIME NULL,
    MODIFY COLUMN duration INT NULL,
    MODIFY COLUMN fare DECIMAL(10,2) NULL,
    MODIFY COLUMN status ENUM('accepted', 'complete', 'in-progress') NOT NULL;
