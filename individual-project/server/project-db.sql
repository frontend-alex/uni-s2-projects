
CREATE TABLE users (
  id              BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(64),
  profile_picture VARCHAR(2048),
  email           VARCHAR(320) NOT NULL UNIQUE,
  role            ENUM('student','admin','moderator') NOT NULL DEFAULT 'student',
  xp              INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE rooms (
  id            BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(128),
  description   TEXT,
  created_by    BIGINT NOT NULL,
  visibility    ENUM('private','public') NOT NULL DEFAULT 'private',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE user_rooms (
  user_id        BIGINT NOT NULL,
  room_id        BIGINT NOT NULL,
  room_role      ENUM('owner','cohost','member') NOT NULL DEFAULT 'member',
  joined_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP NULL,
  PRIMARY KEY (user_id, room_id),
  CONSTRAINT fk_user_rooms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_rooms_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE room_invitations (
  id            BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id       BIGINT NOT NULL,
  invited_email VARCHAR(320) NOT NULL,
  invited_by    BIGINT NOT NULL,
  token         VARCHAR(255) NOT NULL UNIQUE,
  status        ENUM('pending','accepted','expired','revoked') NOT NULL DEFAULT 'pending',
  expires_at    TIMESTAMP NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_invitations_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_room_invitations_invited_by FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE room_sessions (
  id             BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id        BIGINT NOT NULL,
  user_id        BIGINT NOT NULL,
  client_id      VARCHAR(128),
  connected_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  disconnected_at TIMESTAMP NULL,
  CONSTRAINT fk_room_sessions_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_room_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE messages (
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id    BIGINT NOT NULL,
  user_id    BIGINT NULL,
  body       TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE documents (
  id            BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id       BIGINT NOT NULL,
  title         VARCHAR(256),
  kind          ENUM('note','whiteboard','outline','worksheet') NOT NULL DEFAULT 'note',
  ydoc_id       VARCHAR(128) NOT NULL UNIQUE,
  created_by    BIGINT NOT NULL,
  is_archived   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_documents_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE document_versions (
  id           BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  document_id  BIGINT NOT NULL,
  version      INT NOT NULL,
  snapshot     JSON,
  created_by   BIGINT NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_document_version UNIQUE (document_id, version),
  CONSTRAINT fk_document_versions_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  CONSTRAINT fk_document_versions_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE flashcard_decks (
  id                 BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id            BIGINT NOT NULL,
  owner_id           BIGINT NULL,
  title              VARCHAR(256),
  source_document_id BIGINT NULL,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_flashcard_decks_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_flashcard_decks_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_flashcard_decks_source_doc FOREIGN KEY (source_document_id) REFERENCES documents(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE flashcards (
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  deck_id    BIGINT NOT NULL,
  question   TEXT,
  answer     TEXT,
  metadata   JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_flashcards_deck FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE quizzes (
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id    BIGINT NOT NULL,
  created_by BIGINT NOT NULL,
  title      VARCHAR(256),
  mode       ENUM('self','live') NOT NULL DEFAULT 'self',
  source     ENUM('deck','document','custom') NOT NULL DEFAULT 'deck',
  source_id  BIGINT NULL,
  settings   JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quizzes_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_quizzes_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE quiz_questions (
  id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quiz_id     BIGINT NOT NULL,
  idx         INT NOT NULL,
  type        ENUM('mcq','true_false','short_answer') NOT NULL DEFAULT 'mcq',
  prompt      TEXT,
  options     JSON,
  answer_key  JSON,
  metadata    JSON,
  CONSTRAINT uq_quiz_question_idx UNIQUE (quiz_id, idx),
  CONSTRAINT fk_quiz_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE quiz_runs (
  id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quiz_id     BIGINT NOT NULL,
  room_id     BIGINT NOT NULL,
  started_by  BIGINT NOT NULL,
  mode        ENUM('self','live') NOT NULL DEFAULT 'self',
  started_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at    TIMESTAMP NULL,
  CONSTRAINT fk_quiz_runs_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_runs_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_runs_started_by FOREIGN KEY (started_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE quiz_run_participants (
  run_id           BIGINT NOT NULL,
  user_id          BIGINT NOT NULL,
  joined_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  score            INT,
  accuracy         DECIMAL(10,5),
  duration_seconds INT,
  PRIMARY KEY (run_id, user_id),
  CONSTRAINT fk_qrp_run FOREIGN KEY (run_id) REFERENCES quiz_runs(id) ON DELETE CASCADE,
  CONSTRAINT fk_qrp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE quiz_answers (
  id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  run_id      BIGINT NOT NULL,
  user_id     BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  answer      JSON,
  is_correct  BOOLEAN,
  confidence  DECIMAL(10,5),
  answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_quiz_answer UNIQUE (run_id, user_id, question_id),
  CONSTRAINT fk_quiz_answers_run FOREIGN KEY (run_id) REFERENCES quiz_runs(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_answers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_answers_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE xp_events (
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  kind       ENUM('quiz_win','quiz_participation','flashcard_mastery','contribution') NOT NULL,
  amount     INT,
  metadata   JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_xp_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE badges (
  id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(128),
  description TEXT,
  icon        VARCHAR(2048)
) ENGINE=InnoDB;

CREATE TABLE user_badges (
  user_id    BIGINT NOT NULL,
  badge_id   BIGINT NOT NULL,
  awarded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id),
  CONSTRAINT fk_user_badges_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_badges_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE integrations (
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scope      VARCHAR(64),
  scope_id   BIGINT NOT NULL,
  provider   ENUM('openai','hf','local'),
  config     JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- indexes
CREATE INDEX ix_user_rooms_room_user   ON user_rooms (room_id, user_id);
CREATE INDEX ix_room_sessions_room     ON room_sessions (room_id);
CREATE INDEX ix_room_sessions_user     ON room_sessions (user_id);
CREATE INDEX ix_messages_room_created  ON messages (room_id, created_at);
CREATE INDEX ix_flashcards_deck        ON flashcards (deck_id);
CREATE INDEX ix_quizzes_room           ON quizzes (room_id);
CREATE INDEX ix_quiz_runs_room_started ON quiz_runs (room_id, started_at);
CREATE INDEX ix_xp_events_user_created ON xp_events (user_id, created_at);
