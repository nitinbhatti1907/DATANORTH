ALTER TABLE "public"."indicators" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."geographies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."indicator_values" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."data_uploads" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."indicators" FROM "anon", "authenticated";
REVOKE ALL ON TABLE "public"."geographies" FROM "anon", "authenticated";
REVOKE ALL ON TABLE "public"."indicator_values" FROM "anon", "authenticated";
REVOKE ALL ON TABLE "public"."data_uploads" FROM "anon", "authenticated";

GRANT SELECT ON TABLE "public"."indicators" TO "anon", "authenticated";
GRANT SELECT ON TABLE "public"."geographies" TO "anon", "authenticated";
GRANT SELECT ON TABLE "public"."indicator_values" TO "anon", "authenticated";

DROP POLICY IF EXISTS "Public read indicators" ON "public"."indicators";
CREATE POLICY "Public read indicators"
  ON "public"."indicators"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

DROP POLICY IF EXISTS "Public read geographies" ON "public"."geographies";
CREATE POLICY "Public read geographies"
  ON "public"."geographies"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

DROP POLICY IF EXISTS "Public read current indicator values" ON "public"."indicator_values";
CREATE POLICY "Public read current indicator values"
  ON "public"."indicator_values"
  FOR SELECT
  TO "anon", "authenticated"
  USING ("is_current" = true);
