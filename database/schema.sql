-- ============================================================
-- MUSEUM OPERATIONS & VISITOR SCHEDULING DATABASE
-- Data Dictionary (Yourdon Notation) — 7 entities
-- Database: museum_ops
-- ============================================================

CREATE DATABASE IF NOT EXISTS museum_ops
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE museum_ops;

-- ============================================================
-- 1. VISITOR
-- ============================================================
CREATE TABLE VISITOR (
  visitorId     VARCHAR(9)   PRIMARY KEY  COMMENT 'VIS-[0-9]{5}, auto-generated',
  lastName      VARCHAR(50)  NOT NULL,
  firstName     VARCHAR(50)  NOT NULL,
  middleName    VARCHAR(50)  DEFAULT NULL COMMENT 'NA',
  contactNumber VARCHAR(16)  NOT NULL     COMMENT '^\+[1-9]\d{1,14}$',
  emailAddress  VARCHAR(100) DEFAULT NULL COMMENT 'NA',
  visitorType   ENUM('Guest','Registered') NOT NULL
) ENGINE=InnoDB;

-- ============================================================
-- 2. VISIT_SCHEDULE
-- ============================================================
CREATE TABLE VISIT_SCHEDULE (
  scheduleId     VARCHAR(12) PRIMARY KEY  COMMENT 'SCH-[0-9]{4}-[0-9]{3}, auto-generated',
  museumSelection ENUM(
    'Penafrancia_Museum',
    'Museo del Seminario Conciliar',
    'UNC Museum',
    'Jesse M. Robredo Museum',
    'Museo Hayskulano'
  ) NOT NULL,
  visitDate      DATE         NOT NULL,
  timeSlot       VARCHAR(20)  NOT NULL     COMMENT 'HH:MM–HH:MM format',
  maxCapacity    INT          NOT NULL     COMMENT '1 - 9999',
  scheduleStatus ENUM('Open','Full','Closed','Holiday','Unavailable') NOT NULL
) ENGINE=InnoDB;

-- ============================================================
-- 3. VISITOR_BOOKING
-- ============================================================
CREATE TABLE VISITOR_BOOKING (
  bookingId        VARCHAR(11) PRIMARY KEY  COMMENT 'BK-[0-9]{4}-[0-9]{3}, auto-generated',
  museumSelection  ENUM(
    'Penafrancia_Museum',
    'Museo del Seminario Conciliar',
    'UNC Museum',
    'Jesse M. Robredo Museum',
    'Museo Hayskulano'
  ) NOT NULL,
  bookingDate      DATE         NOT NULL,
  bookingType      ENUM('Individual','Group','School','Senior','Private Tour') NOT NULL,
  bookingStatus    ENUM('Pending','Confirmed','Cancelled') NOT NULL,
  numberOfVisitors INT          NOT NULL     COMMENT '1 - 9999',
  specialRequest   VARCHAR(300) DEFAULT NULL COMMENT 'NA',
  visitorId        VARCHAR(9)   NOT NULL,
  scheduleId       VARCHAR(12)  NOT NULL,
  FOREIGN KEY (visitorId) REFERENCES VISITOR(visitorId) ON DELETE CASCADE,
  FOREIGN KEY (scheduleId) REFERENCES VISIT_SCHEDULE(scheduleId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. STAFF_ASSIGNMENT
-- ============================================================
CREATE TABLE STAFF_ASSIGNMENT (
  assignmentId     VARCHAR(9)  PRIMARY KEY  COMMENT 'ASG-[0-9]{5}, auto-generated',
  museumSelection  ENUM(
    'Penafrancia_Museum',
    'Museo del Seminario Conciliar',
    'UNC Museum',
    'Jesse M. Robredo Museum',
    'Museo Hayskulano'
  ) NOT NULL,
  assignmentStatus ENUM('Assigned','Reassigned','Cancelled') NOT NULL,
  assignmentDate   DATE        NOT NULL     COMMENT 'auto-generated',
  scheduleId       VARCHAR(12) NOT NULL,
   userId           VARCHAR(15) NOT NULL     COMMENT 'FK → USER (external entity) — staff being assigned',
  FOREIGN KEY (scheduleId) REFERENCES VISIT_SCHEDULE(scheduleId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. WALK_IN_VISITOR
-- ============================================================
CREATE TABLE WALK_IN_VISITOR (
  walkInId         VARCHAR(9)  PRIMARY KEY  COMMENT 'WLK-[0-9]{5}, auto-generated',
  museumSelection  ENUM(
    'Penafrancia_Museum',
    'Museo del Seminario Conciliar',
    'UNC Museum',
    'Jesse M. Robredo Museum',
    'Museo Hayskulano'
  ) NOT NULL,
  lastName         VARCHAR(50)  NOT NULL,
  firstName        VARCHAR(50)  NOT NULL,
  middleName       VARCHAR(50)  DEFAULT NULL COMMENT 'NA',
  contactNumber    VARCHAR(16)  NOT NULL     COMMENT '^\+[1-9]\d{1,14}$',
  emailAddress     VARCHAR(100) DEFAULT NULL COMMENT 'NA',
  numberOfVisitors INT          NOT NULL     COMMENT '1 - 9999',
  registrationDate DATE         NOT NULL     COMMENT 'auto-generated',
  registrationTime TIME         NOT NULL     COMMENT 'auto-generated',
  scheduleId       VARCHAR(12)  NOT NULL,
  recordingStaff   VARCHAR(50)  NOT NULL,
  FOREIGN KEY (scheduleId) REFERENCES VISIT_SCHEDULE(scheduleId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. ATTENDANCE_LOG
-- ============================================================
CREATE TABLE ATTENDANCE_LOG (
  logId            VARCHAR(14) PRIMARY KEY  COMMENT 'LOG-[0-9]{4}-[0-9]{5}, auto-generated',
  museumSelection  ENUM(
    'Penafrancia_Museum',
    'Museo del Seminario Conciliar',
    'UNC Museum',
    'Jesse M. Robredo Museum',
    'Museo Hayskulano'
  ) NOT NULL,
  arrivalDate      DATE         NOT NULL,
  arrivalTime      TIME         NOT NULL     COMMENT 'HH:MM:SS',
  departureTime    TIME         DEFAULT NULL COMMENT 'HH:MM:SS, NULL if still on-site',
  entryType        ENUM('Pre-booked','Walk-in') NOT NULL,
  attendanceStatus ENUM('Present','Absent','Late') NOT NULL,
  scheduleId       VARCHAR(12)  NOT NULL,
  bookingId        VARCHAR(11)  DEFAULT NULL COMMENT 'NULL if entryType = Walk-in',
  walkInId         VARCHAR(9)   DEFAULT NULL COMMENT 'NULL if entryType = Pre-booked',
   userId           VARCHAR(15)  NOT NULL     COMMENT 'FK → USER (external entity) — staff who recorded',
  FOREIGN KEY (scheduleId) REFERENCES VISIT_SCHEDULE(scheduleId) ON DELETE CASCADE,
  FOREIGN KEY (bookingId)  REFERENCES VISITOR_BOOKING(bookingId) ON DELETE SET NULL,
  FOREIGN KEY (walkInId)   REFERENCES WALK_IN_VISITOR(walkInId)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 7. NOTIFICATION_RECORD
-- ============================================================
CREATE TABLE NOTIFICATION_RECORD (
  notificationId     VARCHAR(9)   PRIMARY KEY COMMENT 'NTF-[0-9]{5}, auto-generated',
  notificationType   ENUM(
    'Booking Confirmation',
    'Booking Update',
    'Staff Assignment',
    'Scheduling Conflict',
    'High Visitor Load',
    'Incomplete Logbook',
    'Upcoming Visit'
  ) NOT NULL,
  notificationChannel ENUM('Email','SMS','System Alert') NOT NULL,
  recipient          VARCHAR(100) NOT NULL     COMMENT 'email address or contact number of recipient',
  dateNotified       DATETIME     NOT NULL     COMMENT 'YYYY-MM-DD HH:MM:SS',
  notificationStatus ENUM('Sent','Failed','Pending') NOT NULL,
  userId             VARCHAR(15) DEFAULT NULL COMMENT 'FK → USER (external entity); NULL if public visitor',
  bookingId          VARCHAR(11)  DEFAULT NULL COMMENT 'FK → VISITOR_BOOKING',
  assignmentId       VARCHAR(9)   DEFAULT NULL COMMENT 'FK → STAFF_ASSIGNMENT',
  scheduleId         VARCHAR(12)  DEFAULT NULL COMMENT 'FK → VISIT_SCHEDULE',
  logId              VARCHAR(14)  DEFAULT NULL COMMENT 'FK → ATTENDANCE_LOG',
  FOREIGN KEY (bookingId)  REFERENCES VISITOR_BOOKING(bookingId)   ON DELETE SET NULL,
  FOREIGN KEY (assignmentId) REFERENCES STAFF_ASSIGNMENT(assignmentId) ON DELETE SET NULL,
  FOREIGN KEY (scheduleId) REFERENCES VISIT_SCHEDULE(scheduleId)   ON DELETE SET NULL,
  FOREIGN KEY (logId)      REFERENCES ATTENDANCE_LOG(logId)        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 8. USERS (auth & staff management)
-- ============================================================
CREATE TABLE users (
  id                VARCHAR(15)  PRIMARY KEY COMMENT 'USR-[PREFIX][0-9]{8}',
  email             VARCHAR(255) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  name              VARCHAR(100) NOT NULL,
  first_name        VARCHAR(50)  DEFAULT '',
  last_name         VARCHAR(50)  DEFAULT '',
  role              VARCHAR(20)  NOT NULL DEFAULT 'General',
  department        VARCHAR(100) DEFAULT '',
  status            VARCHAR(20)  NOT NULL DEFAULT 'Active',
  joined_date       DATE         DEFAULT NULL,
  auth_token        VARCHAR(128) DEFAULT NULL COMMENT '256-bit random hex token',
  auth_token_expires DATETIME    DEFAULT NULL,
  INDEX idx_email (email),
  INDEX idx_auth_token (auth_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_booking_visitor   ON VISITOR_BOOKING(visitorId);
CREATE INDEX idx_booking_schedule  ON VISITOR_BOOKING(scheduleId);
CREATE INDEX idx_booking_date      ON VISITOR_BOOKING(bookingDate);
CREATE INDEX idx_attendance_sched  ON ATTENDANCE_LOG(scheduleId);
CREATE INDEX idx_attendance_date   ON ATTENDANCE_LOG(arrivalDate);
CREATE INDEX idx_assignment_sched  ON STAFF_ASSIGNMENT(scheduleId);
CREATE INDEX idx_assignment_user   ON STAFF_ASSIGNMENT(userId);
CREATE INDEX idx_walkin_sched      ON WALK_IN_VISITOR(scheduleId);
CREATE INDEX idx_notif_user        ON NOTIFICATION_RECORD(userId);
CREATE INDEX idx_notif_booking     ON NOTIFICATION_RECORD(bookingId);
CREATE INDEX idx_schedule_date     ON VISIT_SCHEDULE(visitDate);
