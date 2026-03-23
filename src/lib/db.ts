import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_URL = process.env.DATABASE_URL ?? 'file:/data/dominion.db'
const DB_PATH = DB_URL.replace('file:', '')

const schema = `
CREATE TABLE IF NOT EXISTS players (
    id       INTEGER PRIMARY KEY,
    name     TEXT NOT NULL,
    nickname TEXT NOT NULL,
    slug     TEXT NOT NULL UNIQUE
);

INSERT OR IGNORE INTO players (id, name, nickname, slug) VALUES
    (1, 'Alay Deliwala',   'The Algorithm', 'alay'),
    (2, 'Komal Deliwala',  'Mom-inion',     'komal'),
    (3, 'Hiren Deliwala',  'The Patriarch', 'hiren'),
    (4, 'Ishani Deliwala', 'Wild Card',     'ishani');

CREATE TABLE IF NOT EXISTS games (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    played_at  TEXT NOT NULL,
    notes      TEXT,
    kingdom    TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT,
    deleted_by INTEGER,
    FOREIGN KEY (deleted_by) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS game_participants (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id   INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    score     INTEGER NOT NULL DEFAULT 0,
    position  INTEGER NOT NULL,
    UNIQUE(game_id, player_id),
    FOREIGN KEY (game_id)   REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE INDEX IF NOT EXISTS idx_games_deleted   ON games(deleted_at);
CREATE INDEX IF NOT EXISTS idx_part_player     ON game_participants(player_id);
CREATE INDEX IF NOT EXISTS idx_part_game       ON game_participants(game_id);
`

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db

  // Ensure data directory exists for local dev
  const dir = path.dirname(DB_PATH)
  if (dir && dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  _db.exec(schema)
  return _db
}
