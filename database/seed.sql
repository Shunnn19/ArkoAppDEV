-- ============================================================
-- Seed Data for Museum Operations & Visitor Scheduling
-- Matches the 8-entity data dictionary
-- ============================================================

USE museum_ops;

-- VISIT_SCHEDULE (needed first for FK references)
INSERT INTO VISIT_SCHEDULE (scheduleId, museumSelection, visitDate, timeSlot, maxCapacity, scheduleStatus) VALUES
('SCH-2026-001', 'Penafrancia_Museum',            '2026-06-01', '09:00–10:00', 40, 'Open'),
('SCH-2026-002', 'Penafrancia_Museum',            '2026-06-01', '10:00–11:00', 40, 'Open'),
('SCH-2026-003', 'Penafrancia_Museum',            '2026-06-01', '11:00–12:00', 40, 'Open'),
('SCH-2026-004', 'Penafrancia_Museum',            '2026-06-01', '13:00–14:00', 40, 'Open'),
('SCH-2026-005', 'Penafrancia_Museum',            '2026-06-01', '14:00–15:00', 40, 'Open'),
('SCH-2026-006', 'Penafrancia_Museum',            '2026-06-01', '15:00–16:00', 40, 'Open'),
('SCH-2026-007', 'Penafrancia_Museum',            '2026-06-01', '16:00–17:00', 40, 'Open'),
('SCH-2026-008', 'Museo del Seminario Conciliar', '2026-06-01', '09:00–10:00', 30, 'Open'),
('SCH-2026-009', 'Museo del Seminario Conciliar', '2026-06-01', '10:00–11:00', 30, 'Open'),
('SCH-2026-010', 'UNC Museum',                   '2026-06-01', '09:00–10:00', 25, 'Open'),
('SCH-2026-011', 'Jesse M. Robredo Museum',      '2026-06-01', '09:00–10:00', 20, 'Open'),
('SCH-2026-012', 'Museo Hayskulano',             '2026-06-01', '09:00–10:00', 35, 'Open'),
('SCH-2026-013', 'Penafrancia_Museum',            '2026-06-02', '09:00–10:00', 40, 'Open'),
('SCH-2026-014', 'Penafrancia_Museum',            '2026-06-02', '10:00–11:00', 40, 'Holiday'),
('SCH-2026-015', 'Penafrancia_Museum',            '2026-06-02', '11:00–12:00', 40, 'Holiday'),
('SCH-2026-016', 'Penafrancia_Museum',            '2026-06-02', '13:00–14:00', 40, 'Closed');

-- VISITOR
INSERT INTO VISITOR (visitorId, lastName, firstName, middleName, contactNumber, emailAddress, visitorType) VALUES
('VIS-00001', 'Johnson', 'Sarah', 'Marie',       '+639171234501', 'sarah.j@email.com',  'Registered'),
('VIS-00002', 'Chen',    'Michael', NULL,         '+639171234502', 'mchen@company.com',  'Registered'),
('VIS-00003', 'Davis',  'Emma',   'Rose',        '+639171234503', 'emma.d@email.com',   'Registered'),
('VIS-00004', 'Garcia', 'Luis',   'Antonio',     '+639171234504', 'luis.g@email.com',   'Guest'),
('VIS-00005', 'Tan',    'Angela', 'Mae',         '+639171234505', 'angela.t@email.com', 'Registered');

-- VISITOR_BOOKING
INSERT INTO VISITOR_BOOKING (bookingId, museumSelection, bookingDate, bookingType, bookingStatus, numberOfVisitors, specialRequest, visitorId, scheduleId) VALUES
('BK-2026-001', 'Penafrancia_Museum',            '2026-05-15', 'Individual',  'Confirmed', 2, NULL,                               'VIS-00001', 'SCH-2026-001'),
('BK-2026-002', 'Penafrancia_Museum',            '2026-05-16', 'Group',       'Confirmed', 10, 'Need wheelchair access',          'VIS-00002', 'SCH-2026-002'),
('BK-2026-003', 'Museo del Seminario Conciliar', '2026-05-17', 'School',      'Pending',   25, 'Educational tour, ages 12-14',    'VIS-00003', 'SCH-2026-008'),
('BK-2026-004', 'UNC Museum',                   '2026-05-18', 'Individual',  'Confirmed', 1, NULL,                               'VIS-00004', 'SCH-2026-010'),
('BK-2026-005', 'Jesse M. Robredo Museum',      '2026-05-19', 'Senior',      'Cancelled', 8, 'Senior citizens, need seating',   'VIS-00005', 'SCH-2026-011');

-- STAFF_ASSIGNMENT
INSERT INTO STAFF_ASSIGNMENT (assignmentId, museumSelection, assignmentStatus, assignmentDate, scheduleId, userId) VALUES
('ASG-00001', 'Penafrancia_Museum',            'Assigned',  '2026-05-20', 'SCH-2026-001', 'USR-PFM00000001'),
('ASG-00002', 'Penafrancia_Museum',            'Assigned',  '2026-05-20', 'SCH-2026-002', 'USR-PFM00000002'),
('ASG-00003', 'Museo del Seminario Conciliar', 'Assigned',  '2026-05-21', 'SCH-2026-008', 'USR-MSC00000001'),
('ASG-00004', 'UNC Museum',                   'Assigned',  '2026-05-21', 'SCH-2026-010', 'USR-UNC00000001'),
('ASG-00005', 'Jesse M. Robredo Museum',      'Cancelled', '2026-05-22', 'SCH-2026-011', 'USR-JRM00000001');

-- WALK_IN_VISITOR
INSERT INTO WALK_IN_VISITOR (walkInId, museumSelection, lastName, firstName, middleName, contactNumber, emailAddress, numberOfVisitors, registrationDate, registrationTime, scheduleId, recordingStaff) VALUES
('WLK-00001', 'Penafrancia_Museum', 'Santos', 'Maria', 'Luna', '+639171234601', NULL,            3, '2026-06-01', '09:15:00', 'SCH-2026-001', 'Ma. Cecilia Obias'),
('WLK-00002', 'Penafrancia_Museum', 'Lim',    'James', NULL,   '+639171234602', 'james.l@email.com', 2, '2026-06-01', '10:30:00', 'SCH-2026-002', 'Rolando Fajardo');

-- ATTENDANCE_LOG
INSERT INTO ATTENDANCE_LOG (logId, museumSelection, arrivalDate, arrivalTime, entryType, attendanceStatus, scheduleId, bookingId, walkInId, userId) VALUES
('LOG-2026-00001', 'Penafrancia_Museum', '2026-06-01', '08:55:00', 'Pre-booked', 'Present', 'SCH-2026-001', 'BK-2026-001', NULL, 'USR-PFM00000001'),
('LOG-2026-00002', 'Penafrancia_Museum', '2026-06-01', '10:05:00', 'Pre-booked', 'Present', 'SCH-2026-002', 'BK-2026-002', NULL, 'USR-PFM00000002'),
('LOG-2026-00003', 'Penafrancia_Museum', '2026-06-01', '09:15:00', 'Walk-in',    'Present', 'SCH-2026-001', NULL, 'WLK-00001', 'USR-PFM00000001'),
('LOG-2026-00004', 'Penafrancia_Museum', '2026-06-01', '10:30:00', 'Walk-in',    'Present', 'SCH-2026-002', NULL, 'WLK-00002', 'USR-PFM00000002');

-- USERS (auth credentials — passwords hashed with bcrypt, cost=10)
INSERT INTO users (id, email, password_hash, name, first_name, last_name, role, department, status, joined_date) VALUES
('USR-CUR00000001', 'curator@museum.com',
 '$2y$10$wT5JbGyRicTNhktbNlRzwe4Ce3bBkCzqSwgT28o89.44Krtk7fJGm',
 'Elizabeth Anderson', 'Elizabeth', 'Anderson', 'curator', 'Curatorial Department', 'Active', '2026-01-15'),
('USR-STF00000001', 'staff@museum.com',
 '$2y$10$NXnLBniXeuRre1CmjPdjwuWmn0H097j.IXJcjdmJma4EvGLCC5Qzu',
 'Jennifer Williams', 'Jennifer', 'Williams', 'staff', 'Museum Operations', 'Active', '2026-02-01'),
('USR-GEN00000001', 'sarah@example.com',
 '$2y$10$NioUn60RFA0ehZqjl.MlHOGcItaNku.OT6jy5pR5lYuHatBhXH3Hi',
 'Sarah Johnson', 'Sarah', 'Johnson', 'general', '', 'Active', '2026-03-10'),
('USR-GEN00000002', 'maria@example.com',
 '$2y$10$NioUn60RFA0ehZqjl.MlHOGcItaNku.OT6jy5pR5lYuHatBhXH3Hi',
 'Maria Rodriguez', 'Maria', 'Rodriguez', 'researcher', '', 'Active', '2026-03-15'),
('USR-GEN00000003', 'michael@example.com',
 '$2y$10$NioUn60RFA0ehZqjl.MlHOGcItaNku.OT6jy5pR5lYuHatBhXH3Hi',
 'Michael Chen', 'Michael', 'Chen', 'educator', '', 'Active', '2026-03-20');

-- NOTIFICATION_RECORD
INSERT INTO NOTIFICATION_RECORD (notificationId, notificationType, notificationChannel, recipient, dateNotified, notificationStatus, userId, bookingId, assignmentId, scheduleId, logId) VALUES
('NTF-00001', 'Booking Confirmation', 'Email', 'sarah.j@email.com',       '2026-05-15 10:30:00', 'Sent',   NULL,             'BK-2026-001', NULL, 'SCH-2026-001', NULL),
('NTF-00002', 'Booking Confirmation', 'Email', 'mchen@company.com',       '2026-05-16 14:00:00', 'Sent',   NULL,             'BK-2026-002', NULL, 'SCH-2026-002', NULL),
('NTF-00003', 'Staff Assignment',     'System Alert', 'USR-PFM00000001', '2026-05-20 08:00:00', 'Sent',   'USR-PFM00000001', 'BK-2026-001', 'ASG-00001', 'SCH-2026-001', NULL),
('NTF-00004', 'High Visitor Load',    'System Alert', 'USR-PFM00000001', '2026-06-01 09:00:00', 'Sent',   'USR-PFM00000001', 'BK-2026-001', NULL, 'SCH-2026-001', NULL);
