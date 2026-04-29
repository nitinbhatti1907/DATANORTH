import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const dynamic = "force-static";

export const metadata = {
  title: "Land acknowledgement",
};

export default function AcknowledgementPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Land acknowledgement" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          Land acknowledgement
        </h1>
        <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-700">
          <p>
            DATANORTH operates on the traditional territories of First Nations
            peoples who have lived on and cared for these lands since time
            immemorial. We acknowledge the sovereignty of the First Nations,
            Métis, and Inuit peoples of Northern Ontario and commit to
            presenting data in a way that respects community data sovereignty
            and self-determination.
          </p>
          <p>
            The specific wording and recognition of nations on whose territories
            the project operates will be developed in consultation with partner
            communities and the NORDIK Institute, and will be updated here as
            that work continues.
          </p>
        </div>
      </div>
    </div>
  );
}
