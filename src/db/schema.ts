import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const uploadStatus = pgEnum("upload_status", [
  "pending",
  "success",
  "failed",
]);

export const uploadSource = pgEnum("upload_source", [
  "admin",
  "etl",
  "seed",
]);

export const indicators = pgTable("indicators", {
  slug: text("slug").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr"),
  category: text("category").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionFr: text("description_fr"),
  unit: text("unit").notNull(),
  higherIsBetter: boolean("higher_is_better"),
  sourceEn: text("source_en").notNull(),
  sourceFr: text("source_fr"),
  sourceUrl: text("source_url").notNull().default(""),
  methodologyEn: text("methodology_en").notNull(),
  methodologyFr: text("methodology_fr"),
  license: text("license").notNull(),
  updateFrequency: text("update_frequency").notNull(),
  lastUpdated: text("last_updated").notNull(),
  featured: boolean("featured").notNull().default(false),
  isSample: boolean("is_sample").notNull().default(true),
  shape: text("shape").notNull().default("timeseries"),
  compositionCategories: jsonb("composition_categories")
    .$type<string[] | null>()
    .default(null),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const geographies = pgTable("geographies", {
  code: text("code").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr"),
  type: text("type").notNull(),
  parentCode: text("parent_code"),
  population: integer("population"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dataUploads = pgTable(
  "data_uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: uploadSource("source").notNull().default("admin"),
    status: uploadStatus("status").notNull().default("pending"),
    filename: text("filename").notNull(),
    originalFilename: text("original_filename"),
    storagePath: text("storage_path"),
    category: text("category"),
    indicatorSlug: text("indicator_slug").references(() => indicators.slug),
    geographyCode: text("geography_code").references(() => geographies.code),
    uploadedBy: text("uploaded_by").notNull(),
    rowCount: integer("row_count").notNull().default(0),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => ({
    createdAtIdx: index("data_uploads_created_at_idx").on(table.createdAt),
    indicatorIdx: index("data_uploads_indicator_idx").on(table.indicatorSlug),
  }),
);

export const indicatorValues = pgTable(
  "indicator_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    indicatorSlug: text("indicator_slug")
      .notNull()
      .references(() => indicators.slug),
    geographyCode: text("geography_code")
      .notNull()
      .references(() => geographies.code),
    year: integer("year").notNull(),
    quarter: integer("quarter"),
    month: integer("month"),
    label: text("label"),
    value: numeric("value").notNull(),
    confidenceLow: numeric("confidence_low"),
    confidenceHigh: numeric("confidence_high"),
    isForecast: boolean("is_forecast").notNull().default(false),
    modelId: text("model_id"),
    uploadId: uuid("upload_id").references(() => dataUploads.id),
    ingestedAt: timestamp("ingested_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ingestedBy: text("ingested_by").notNull(),
    isCurrent: boolean("is_current").notNull().default(true),
  },
  (table) => ({
    lookupIdx: index("indicator_values_lookup_idx").on(
      table.indicatorSlug,
      table.geographyCode,
      table.year,
      table.isCurrent,
    ),
    uploadIdx: index("indicator_values_upload_idx").on(table.uploadId),
  }),
);
