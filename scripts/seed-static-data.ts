import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../src/db/client";
import {
  dataUploads,
  geographies,
  indicators,
  indicatorValues,
} from "../src/db/schema";
import { GEOGRAPHIES } from "../src/lib/data/geographies";
import { INDICATORS } from "../src/lib/data/indicators";
import {
  COMPOSITION_VALUES,
  INDICATOR_VALUES,
} from "../src/lib/data/values";

async function main() {
  const db = getDb();

  console.log("Seeding indicators...");
  for (const indicator of INDICATORS) {
    await db
      .insert(indicators)
      .values({
        slug: indicator.slug,
        nameEn: indicator.name,
        category: indicator.category,
        descriptionEn: indicator.description,
        unit: indicator.unit,
        higherIsBetter: indicator.higherIsBetter,
        sourceEn: indicator.source,
        sourceUrl: indicator.sourceUrl,
        methodologyEn: indicator.methodology,
        license: indicator.license,
        updateFrequency: indicator.updateFrequency,
        lastUpdated: indicator.lastUpdated,
        featured: indicator.featured ?? false,
        isSample: indicator.isSample ?? true,
        shape: indicator.shape ?? "timeseries",
        compositionCategories: indicator.compositionCategories ?? null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: indicators.slug,
        set: {
          nameEn: indicator.name,
          category: indicator.category,
          descriptionEn: indicator.description,
          unit: indicator.unit,
          higherIsBetter: indicator.higherIsBetter,
          sourceEn: indicator.source,
          sourceUrl: indicator.sourceUrl,
          methodologyEn: indicator.methodology,
          license: indicator.license,
          updateFrequency: indicator.updateFrequency,
          lastUpdated: indicator.lastUpdated,
          featured: indicator.featured ?? false,
          isSample: indicator.isSample ?? true,
          shape: indicator.shape ?? "timeseries",
          compositionCategories: indicator.compositionCategories ?? null,
          updatedAt: new Date(),
        },
      });
  }

  console.log("Seeding geographies...");
  for (const geography of GEOGRAPHIES) {
    await db
      .insert(geographies)
      .values({
        code: geography.code,
        nameEn: geography.name,
        type: geography.type,
        parentCode: geography.parentCode,
        population: geography.population,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: geographies.code,
        set: {
          nameEn: geography.name,
          type: geography.type,
          parentCode: geography.parentCode,
          population: geography.population,
          updatedAt: new Date(),
        },
      });
  }

  const [upload] = await db
    .insert(dataUploads)
    .values({
      source: "seed",
      status: "pending",
      filename: "static-seed",
      originalFilename: "src/lib/data",
      uploadedBy: "seed-static-data",
      rowCount: INDICATOR_VALUES.length + COMPOSITION_VALUES.length,
    })
    .returning();

  console.log("Seeding indicator values...");
  for (const row of INDICATOR_VALUES) {
    await db
      .update(indicatorValues)
      .set({ isCurrent: false })
      .where(
        and(
          eq(indicatorValues.indicatorSlug, row.indicatorSlug),
          eq(indicatorValues.geographyCode, row.geographyCode),
          eq(indicatorValues.year, row.year),
          isNull(indicatorValues.label),
          eq(indicatorValues.isCurrent, true),
        ),
      );

    await db.insert(indicatorValues).values({
      indicatorSlug: row.indicatorSlug,
      geographyCode: row.geographyCode,
      year: row.year,
      quarter: row.quarter,
      month: row.month,
      value: String(row.value),
      confidenceLow:
        row.confidenceLow == null ? undefined : String(row.confidenceLow),
      confidenceHigh:
        row.confidenceHigh == null ? undefined : String(row.confidenceHigh),
      isForecast: row.isForecast ?? false,
      modelId: row.modelId,
      uploadId: upload.id,
      ingestedBy: "seed-static-data",
      isCurrent: true,
    });
  }

  console.log("Seeding composition values...");
  for (const row of COMPOSITION_VALUES) {
    await db
      .update(indicatorValues)
      .set({ isCurrent: false })
      .where(
        and(
          eq(indicatorValues.indicatorSlug, row.indicatorSlug),
          eq(indicatorValues.geographyCode, row.geographyCode),
          eq(indicatorValues.year, row.year),
          eq(indicatorValues.label, row.label),
          eq(indicatorValues.isCurrent, true),
        ),
      );

    await db.insert(indicatorValues).values({
      indicatorSlug: row.indicatorSlug,
      geographyCode: row.geographyCode,
      year: row.year,
      label: row.label,
      value: String(row.value),
      uploadId: upload.id,
      ingestedBy: "seed-static-data",
      isCurrent: true,
    });
  }

  await db
    .update(dataUploads)
    .set({ status: "success", completedAt: new Date() })
    .where(eq(dataUploads.id, upload.id));

  console.log(
    `Seed complete: ${INDICATOR_VALUES.length + COMPOSITION_VALUES.length} values.`,
  );
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
