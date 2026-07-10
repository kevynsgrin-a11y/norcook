-- Shoreburst — reference PostgreSQL schema (normalized).
-- The app currently runs on typed mock data (lib/data/recipes.ts) + a mock
-- Redis sorted set (lib/data/mock-redis.ts). This DDL documents the shape the
-- data layer would map to in production.

CREATE TABLE creators (
  id              TEXT PRIMARY KEY,
  handle          TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  avatar_url      TEXT,
  bio             TEXT,
  verified        BOOLEAN NOT NULL DEFAULT FALSE,
  followers       INTEGER NOT NULL DEFAULT 0,
  -- Stripe Connect (Express/Standard) account used for payout transfers.
  stripe_account_id TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recipes (
  id                       TEXT PRIMARY KEY,
  slug                     TEXT UNIQUE NOT NULL,
  title                    TEXT NOT NULL,
  description              TEXT,
  cuisine                  TEXT,
  total_time_minutes       INTEGER,
  servings                 INTEGER,
  difficulty               TEXT CHECK (difficulty IN ('easy','medium','hard')),
  -- Mux playback id (resolve to https://stream.mux.com/<id>.m3u8 for HLS).
  mux_playback_id          TEXT,
  video_src                TEXT NOT NULL,
  poster_url               TEXT,
  duration_seconds         INTEGER NOT NULL,
  creator_id               TEXT NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  -- per-serving macros
  protein_g                NUMERIC(6,2),
  carbs_g                  NUMERIC(6,2),
  fats_g                   NUMERIC(6,2),
  calories                 INTEGER,
  -- Primary feed ranking weight; mirrored into the Redis sorted set.
  viral_coefficient_score  NUMERIC(8,3) NOT NULL DEFAULT 0,
  likes                    INTEGER NOT NULL DEFAULT 0,
  shares                   INTEGER NOT NULL DEFAULT 0,
  saves                    INTEGER NOT NULL DEFAULT 0,
  published_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  tags                     TEXT[] NOT NULL DEFAULT '{}'
);

-- Hot path index for "ORDER BY viral_coefficient_score DESC LIMIT n".
CREATE INDEX idx_recipes_vcs ON recipes (viral_coefficient_score DESC);

CREATE TABLE ingredients (
  id          TEXT PRIMARY KEY,
  recipe_id   TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  quantity    TEXT,            -- human display, e.g. "2 tbsp"
  unit        TEXT,            -- Instacart measurement unit, e.g. "tablespoon"
  amount      NUMERIC(8,2),    -- numeric amount for line items
  position    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_ingredients_recipe ON ingredients (recipe_id);

CREATE TABLE instruction_steps (
  id            TEXT PRIMARY KEY,
  recipe_id     TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_order    INTEGER NOT NULL,
  text          TEXT NOT NULL,
  -- Video timing for synced overlays + JSON-LD HowToStep clips.
  start_offset  INTEGER NOT NULL,  -- seconds
  end_offset    INTEGER NOT NULL   -- seconds
);
CREATE INDEX idx_steps_recipe ON instruction_steps (recipe_id, step_order);

CREATE TABLE affiliate_links (
  id              TEXT PRIMARY KEY,
  ingredient_id   TEXT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  retailer        TEXT NOT NULL,
  url             TEXT NOT NULL,
  commission_rate NUMERIC(4,3) NOT NULL DEFAULT 0
);
CREATE INDEX idx_affiliate_ingredient ON affiliate_links (ingredient_id);
