BEGIN;
CREATE TABLE IF NOT EXISTS castelinho_proposals (
  id text PRIMARY KEY CHECK (id = 'castelinho-vivo'),
  revision bigint NOT NULL CHECK (revision > 0),
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS castelinho_proposal_history (
  proposal_id text NOT NULL REFERENCES castelinho_proposals(id),
  revision bigint NOT NULL,
  data jsonb NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (proposal_id, revision)
);
COMMIT;
