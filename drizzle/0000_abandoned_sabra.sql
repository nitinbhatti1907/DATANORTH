CREATE TYPE "public"."upload_source" AS ENUM('admin', 'etl', 'seed');--> statement-breakpoint
CREATE TYPE "public"."upload_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TABLE "data_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "upload_source" DEFAULT 'admin' NOT NULL,
	"status" "upload_status" DEFAULT 'pending' NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text,
	"storage_path" text,
	"category" text,
	"indicator_slug" text,
	"geography_code" text,
	"uploaded_by" text NOT NULL,
	"row_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "geographies" (
	"code" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_fr" text,
	"type" text NOT NULL,
	"parent_code" text,
	"population" integer,
	"latitude" numeric,
	"longitude" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicator_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"indicator_slug" text NOT NULL,
	"geography_code" text NOT NULL,
	"year" integer NOT NULL,
	"quarter" integer,
	"month" integer,
	"label" text,
	"value" numeric NOT NULL,
	"confidence_low" numeric,
	"confidence_high" numeric,
	"is_forecast" boolean DEFAULT false NOT NULL,
	"model_id" text,
	"upload_id" uuid,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ingested_by" text NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicators" (
	"slug" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_fr" text,
	"category" text NOT NULL,
	"description_en" text NOT NULL,
	"description_fr" text,
	"unit" text NOT NULL,
	"higher_is_better" boolean,
	"source_en" text NOT NULL,
	"source_fr" text,
	"source_url" text DEFAULT '' NOT NULL,
	"methodology_en" text NOT NULL,
	"methodology_fr" text,
	"license" text NOT NULL,
	"update_frequency" text NOT NULL,
	"last_updated" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"is_sample" boolean DEFAULT true NOT NULL,
	"shape" text DEFAULT 'timeseries' NOT NULL,
	"composition_categories" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "data_uploads" ADD CONSTRAINT "data_uploads_indicator_slug_indicators_slug_fk" FOREIGN KEY ("indicator_slug") REFERENCES "public"."indicators"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_uploads" ADD CONSTRAINT "data_uploads_geography_code_geographies_code_fk" FOREIGN KEY ("geography_code") REFERENCES "public"."geographies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicator_values" ADD CONSTRAINT "indicator_values_indicator_slug_indicators_slug_fk" FOREIGN KEY ("indicator_slug") REFERENCES "public"."indicators"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicator_values" ADD CONSTRAINT "indicator_values_geography_code_geographies_code_fk" FOREIGN KEY ("geography_code") REFERENCES "public"."geographies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicator_values" ADD CONSTRAINT "indicator_values_upload_id_data_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."data_uploads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "data_uploads_created_at_idx" ON "data_uploads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "data_uploads_indicator_idx" ON "data_uploads" USING btree ("indicator_slug");--> statement-breakpoint
CREATE INDEX "indicator_values_lookup_idx" ON "indicator_values" USING btree ("indicator_slug","geography_code","year","is_current");--> statement-breakpoint
CREATE INDEX "indicator_values_upload_idx" ON "indicator_values" USING btree ("upload_id");