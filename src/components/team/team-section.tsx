import Link from "next/link";
import { Linkedin, ArrowUpRight } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  affiliation?: string;
  linkedin?: string;
  image?: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Dr. Tamanna Rimi",
    role: "Project Lead",
    affiliation: "Director of Research, NORDIK Institute",
    linkedin:
      "https://linkedin.com/in/tamanna-rimi-1348b420b",
  },
  {
    name: "Dr. Ahmed Aziz",
    role: "Research Associate, NORDIK Institute",
    affiliation:
      "Assistant Professor, Department of Finance, Economics and Decision Sciences (FEDS), Algoma University",
    linkedin: "https://www.linkedin.com/in/ahmedtariqaziz/",
  },
  {
    name: "Dr. Zamilur Rahman",
    role: "Research Associate, NORDIK Institute",
    affiliation: "Assistant Professor, Department of Computer Science & Mathematics, Algoma University",
    linkedin: "https://www.linkedin.com/in/zamiljitu/",
  },
  {
    name: "Dr. Muhammad Azam",
    role: "Research Associate, NORDIK Institute",
    affiliation:
      "Assistant Professor, Department of Computer Science, Algoma University",
    linkedin: "https://www.linkedin.com/in/muhammad-azam-ph-d-063b385b/",
  },
  {
    name: "Md. Soaib Hossain",
    role: "Project Coordinator",
    affiliation:
      "Community Economic Development and Outreach Coordinator, NORDIK Institute",
    linkedin: "https://www.linkedin.com/in/mdsoaibhossain/",
  },
  {
    name: "Nitin Bhatti",
    role: "Project Developer",
    affiliation: "Data Analyst Intern, NORDIK Institute",
    linkedin: "https://www.linkedin.com/in/bhattinitin/",
  },
];

const AVATAR_GRADIENTS: [string, string][] = [
  ["#164284", "#2563a8"],
  ["#b45309", "#d97706"],
  ["#047857", "#10b981"],
  ["#6d28d9", "#8b5cf6"],
  ["#0369a1", "#0ea5e9"],
  ["#be123c", "#e11d48"],
];

function gradientFor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_GRADIENTS[Math.abs(h) % AVATAR_GRADIENTS.length];
}

function initials(name: string) {
  // Strip honorifics like "Dr.", "Mr.", "Ms.", "Md." before computing initials
  const cleaned = name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?|Md\.?)\s+/i, "");
  return cleaned
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamSection() {
  return (
    <section aria-labelledby="team-heading">
      <div className="max-w-2xl">
        <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
          The team
        </div>

        <h2
          id="team-heading"
          className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900"
        >
          People behind DATANORTH.
        </h2>

        <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
          A small team of researchers, analysts, and developers at NORDIK
          Institute building DATANORTH together.
        </p>
      </div>

      {/* 5-member layout:
          - mobile: 1 column
          - sm: 2 columns (last card spans both)
          - lg: 3 columns top row, then last 2 centered below */}
      {/* 6-member layout: 3 columns × 2 rows on desktop, 2 columns on tablet, 1 on mobile */}
      <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m) => {
          const [c1, c2] = gradientFor(m.name);

          return (
            <li key={m.name}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-elev-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-elev-3">
                {/* Accent bar at top */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${c1} 0%, ${c2} 100%)`,
                  }}
                />

                {/* Decorative background blob */}
                <div
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.15]"
                  style={{ background: c1 }}
                  aria-hidden
                />

                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="absolute -inset-0.5 rounded-full opacity-30 blur transition-opacity duration-300 group-hover:opacity-60"
                        style={{
                          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
                        }}
                        aria-hidden
                      />

                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.image}
                          alt={m.name}
                          className="relative h-16 w-16 rounded-full border-2 border-white object-cover shadow-elev-1"
                        />
                      ) : (
                        <div
                          className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-lg font-semibold text-white shadow-elev-1"
                          style={{
                            background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
                          }}
                          aria-hidden
                        >
                          {initials(m.name)}
                        </div>
                      )}
                    </div>

                    {/* Name + role */}
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="font-display text-lg font-semibold tracking-tight text-ink-900">
                        {m.name}
                      </div>

                      <div className="mt-1 text-sm font-medium text-ink-700">
                        {m.role}
                      </div>

                      {m.affiliation && (
                        <div className="mt-0.5 text-xs text-ink-500">
                          {m.affiliation}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn link */}
                  <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
                    {m.linkedin ? (
                      <Link
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-nordik-700 transition-colors hover:text-nordik-800"
                        aria-label={`${m.name} on LinkedIn`}
                      >
                        <Linkedin className="h-3.5 w-3.5" aria-hidden />
                        Connect on LinkedIn
                      </Link>
                    ) : (
                      <span className="text-xs text-ink-400">
                        LinkedIn coming soon
                      </span>
                    )}

                    {m.linkedin && (
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-ink-400 transition-all group-hover:translate-x-0.5 group-hover:text-nordik-700"
                        aria-hidden
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}