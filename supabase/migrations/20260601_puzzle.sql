-- Skyblock Puzzle Hunt — player tracking

CREATE TABLE puzzle_players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ign             TEXT NOT NULL,
  ign_lower       TEXT NOT NULL UNIQUE,
  discord         TEXT,
  player_token    TEXT NOT NULL UNIQUE,
  entry_confirmed BOOLEAN NOT NULL DEFAULT false,
  current_clue    INT NOT NULL DEFAULT 1,
  completed       BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  wrong_attempts  INT NOT NULL DEFAULT 0,
  last_wrong_at   TIMESTAMPTZ,
  registered_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_puzzle_players_token ON puzzle_players(player_token);
CREATE INDEX idx_puzzle_players_leaderboard ON puzzle_players(current_clue DESC, last_active_at ASC);
