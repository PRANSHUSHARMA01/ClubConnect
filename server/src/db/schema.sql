CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS seed_versions (
  version VARCHAR(128) PRIMARY KEY,
  applied_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(64) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  attendees INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  INDEX idx_events_date (event_date),
  INDEX idx_events_category (category)
);

CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(64) PRIMARY KEY,
  event_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  college VARCHAR(255) NOT NULL,
  year VARCHAR(32) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  registered_at DATETIME NOT NULL,
  UNIQUE KEY unique_event_email (event_id, email),
  INDEX idx_registrations_name (name),
  INDEX idx_registrations_email (email),
  CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
