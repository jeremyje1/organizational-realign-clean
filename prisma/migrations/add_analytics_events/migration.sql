-- CreateTable for analytics_events
CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" UUID DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "user_id" UUID,
  "event_type" TEXT NOT NULL,
  "event_action" TEXT NOT NULL,
  "properties" JSONB DEFAULT '{}'::jsonb,
  "url" TEXT,
  "referrer" TEXT,
  "user_agent" TEXT,
  "ip_address" TEXT,
  PRIMARY KEY ("id")
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "analytics_events_user_id_idx" ON "analytics_events" ("user_id");
CREATE INDEX IF NOT EXISTS "analytics_events_event_type_idx" ON "analytics_events" ("event_type");
CREATE INDEX IF NOT EXISTS "analytics_events_created_at_idx" ON "analytics_events" ("created_at");

-- Add foreign key constraint if users table exists
ALTER TABLE "analytics_events" 
  ADD CONSTRAINT "analytics_events_user_id_fkey" 
  FOREIGN KEY ("user_id") 
  REFERENCES "users" ("id") 
  ON DELETE SET NULL;

-- Create RLS policies for analytics_events
ALTER TABLE "analytics_events" ENABLE ROW LEVEL SECURITY;

-- Only allow admins to read analytics data
CREATE POLICY "Allow admins to read analytics" ON "analytics_events"
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Allow any authenticated user to insert their own analytics events
CREATE POLICY "Allow users to insert their own analytics" ON "analytics_events"
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );
