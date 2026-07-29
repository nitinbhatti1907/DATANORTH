import type { Category, CategorySlug, Geography, Indicator } from "@/types";

export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "datanorth-locale";
export const LOCALE_HEADER = "x-datanorth-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const normalized = value.toLowerCase().split("-")[0];
  return isLocale(normalized) ? normalized : DEFAULT_LOCALE;
}

export function getPathLocale(pathname: string | null | undefined): Locale | null {
  const segment = pathname?.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : null;
}

export function stripLocale(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const parts = pathname.split("/").filter(Boolean);
  if (isLocale(parts[0])) parts.shift();
  return parts.length ? `/${parts.join("/")}` : "/";
}

export function localizePath(
  pathname: string,
  locale: Locale,
  search = "",
): string {
  if (/^https?:\/\//.test(pathname) || pathname.startsWith("#")) {
    return pathname;
  }

  const cleanPath = stripLocale(pathname);
  const localizedPath = cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
  return `${localizedPath}${search}`;
}

export function localeFromPath(pathname: string | null | undefined): Locale {
  return getPathLocale(pathname) ?? DEFAULT_LOCALE;
}

export const translations = {
  en: {
    common: {
      home: "Home",
      skipToMain: "Skip to main content",
      source: "Source:",
      updated: "Updated",
      sampleData: "Sample data",
      sample: "sample",
      methodology: "Methodology",
      methodologyArrow: "Methodology ->",
      loadingData: "Loading data...",
      loadingChart: "Loading chart...",
      noData: "No data matches the current filters. Try adding a geography.",
      noRecentData: "No recent data",
      all: "All",
      from: "From",
      to: "To",
      geography: "Geography",
      yoy: "yoy",
      unit: "Unit",
      updates: "Updates",
      lastUpdated: "Last updated",
      license: "License",
      sourceUrl: "Source URL",
      rows: "rows",
      row: "row",
      filteredBy: "filtered by",
      noResults: "No results.",
      previous: "Prev",
      next: "Next",
    },
    nav: {
      explore: "Explore Data",
      categories: "Categories",
      communities: "Communities",
      methodology: "Methodology",
      about: "About",
      toggleMenu: "Toggle menu",
      homeLabel: "DATANORTH - home",
      language: "Language",
      english: "English",
      french: "French",
    },
    footer: {
      description:
        "A public data platform for Northern Ontario communities, developed by NORDIK Institute.",
      visitNordik: "Visit nordikinstitute.com",
      copyright:
        "DATANORTH. Data is attributed to its original sources - see each chart's methodology.",
      sections: {
        data: "Data",
        transparency: "Transparency",
        project: "Project",
      },
      links: {
        explore: "Explore data",
        allCategories: "All categories",
        communities: "Communities",
        allIndicators: "All indicators",
        methodologySources: "Methodology & sources",
        accessibility: "Accessibility",
        landAcknowledgement: "Land acknowledgement",
        about: "About DATANORTH",
        partners: "Partners",
        contact: "Contact",
      },
    },
      chart: {
      viewLabel: "Chart view",
      line: "Line",
      bar: "Bar",
      area: "Area",
      stacked: "Stacked",
      pie: "Pie",
      donut: "Donut",
      table: "Table",
      pieLimit:
        "Pie charts compare up to {limit} communities at a time. Showing the first {limit}. Switch to Bar or Stacked to see all selected communities.",
      atAGlance: "At a glance",
      latestReadings: "Latest readings",
      dashboardFilters:
        "Filters apply to every chart on this dashboard. Year range only affects time-series charts.",
      download: "Download",
      downloadCsv: "Download CSV",
      downloadExcel: "Download Excel",
      csvHelp: "With active filters & source",
      excelHelp: "Includes methodology sheet",
      copyLink: "Copy link",
      linkCopied: "Link copied",
      linkHelp: "Filters included in URL",
      category: "Category",
      indicators: "indicators",
      explore: "Explore",
    },
  },
  fr: {
    common: {
      home: "Accueil",
      skipToMain: "Passer au contenu principal",
      source: "Source :",
      updated: "Mis a jour",
      sampleData: "Donnees d'exemple",
      sample: "exemple",
      methodology: "Methodologie",
      methodologyArrow: "Methodologie ->",
      loadingData: "Chargement des donnees...",
      loadingChart: "Chargement du graphique...",
      noData:
        "Aucune donnee ne correspond aux filtres actuels. Essayez d'ajouter une geographie.",
      noRecentData: "Aucune donnee recente",
      all: "Tout",
      from: "De",
      to: "A",
      geography: "Geographie",
      yoy: "a/a",
      unit: "Unite",
      updates: "Mises a jour",
      lastUpdated: "Derniere mise a jour",
      license: "Licence",
      sourceUrl: "URL de la source",
      rows: "lignes",
      row: "ligne",
      filteredBy: "filtre par",
      noResults: "Aucun resultat.",
      previous: "Prec.",
      next: "Suiv.",
    },
    nav: {
      explore: "Explorer les donnees",
      categories: "Categories",
      communities: "Communautes",
      methodology: "Methodologie",
      about: "A propos",
      toggleMenu: "Ouvrir ou fermer le menu",
      homeLabel: "DATANORTH - accueil",
      language: "Langue",
      english: "Anglais",
      french: "Francais",
    },
    footer: {
      description:
        "Une plateforme publique de donnees pour les communautes du Nord de l'Ontario, developpee par l'Institut NORDIK.",
      visitNordik: "Visiter nordikinstitute.com",
      copyright:
        "DATANORTH. Les donnees sont attribuees a leurs sources originales - consultez la methodologie de chaque graphique.",
      sections: {
        data: "Donnees",
        transparency: "Transparence",
        project: "Projet",
      },
      links: {
        explore: "Explorer les donnees",
        allCategories: "Toutes les categories",
        communities: "Communautes",
        allIndicators: "Tous les indicateurs",
        methodologySources: "Methodologie et sources",
        accessibility: "Accessibilite",
        landAcknowledgement: "Reconnaissance territoriale",
        about: "A propos de DATANORTH",
        partners: "Partenaires",
        contact: "Contact",
      },
    },
      chart: {
      viewLabel: "Vue du graphique",
      line: "Ligne",
      bar: "Barres",
      area: "Zone",
      stacked: "Empile",
      pie: "Secteurs",
      donut: "Anneau",
      table: "Tableau",
      pieLimit:
        "Les graphiques circulaires comparent jusqu'a {limit} communautes a la fois. Les {limit} premieres sont affichees. Passez aux barres ou aux barres empilees pour voir toutes les communautes selectionnees.",
      atAGlance: "En bref",
      latestReadings: "Dernieres donnees",
      dashboardFilters:
        "Les filtres s'appliquent a tous les graphiques de ce tableau de bord. La plage d'annees ne touche que les series chronologiques.",
      download: "Telecharger",
      downloadCsv: "Telecharger CSV",
      downloadExcel: "Telecharger Excel",
      csvHelp: "Avec les filtres actifs et la source",
      excelHelp: "Inclut la feuille de methodologie",
      copyLink: "Copier le lien",
      linkCopied: "Lien copie",
      linkHelp: "Filtres inclus dans l'URL",
      category: "Categorie",
      indicators: "indicateurs",
      explore: "Explorer",
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

const CATEGORY_TRANSLATIONS: Record<
  CategorySlug,
  Pick<Category, "name" | "shortName" | "description" | "longDescription">
> = {
  population: {
    name: "Population",
    shortName: "Population",
    description: "Qui vit dans le Nord de l'Ontario et comment cela evolue.",
    longDescription:
      "Indicateurs demographiques, y compris la population, la structure par age, la taille des menages, la migration et les taux de croissance dans le Nord.",
  },
  housing: {
    name: "Logement",
    shortName: "Logement",
    description: "Abordabilite, disponibilite et conditions du logement.",
    longDescription:
      "Indicateurs sur les taux de propriete, l'abordabilite des loyers, les valeurs des logements, les mises en chantier et les besoins imperieux en logement.",
  },
  "health-and-wellbeing": {
    name: "Sante et bien-etre",
    shortName: "Sante",
    description:
      "Resultats de sante, services et determinants du bien-etre.",
    longDescription:
      "Indicateurs de sante physique et mentale, d'acces aux soins, de temps d'attente, de disponibilite des services et de determinants sociaux de la sante.",
  },
  "labour-market": {
    name: "Marche du travail",
    shortName: "Travail",
    description: "Emploi, salaires et tendances professionnelles.",
    longDescription:
      "Taux d'emploi et de chomage, salaires medians par profession, participation a la population active et postes vacants.",
  },
  education: {
    name: "Education",
    shortName: "Education",
    description: "Niveau de scolarite et resultats d'apprentissage.",
    longDescription:
      "Taux de diplomation, inscriptions postsecondaires, indicateurs de la petite enfance et participation a l'education des adultes.",
  },
  economy: {
    name: "Economie",
    shortName: "Economie",
    description: "Revenu, industries et activite economique.",
    longDescription:
      "Revenu median des menages, PIB, nombre d'entreprises, composition industrielle et indicateurs de croissance economique.",
  },
  "climate-and-environment": {
    name: "Climat et environnement",
    shortName: "Climat",
    description:
      "Tendances meteorologiques, climat et qualite de l'environnement.",
    longDescription:
      "Tendances de temperature, precipitation, qualite de l'air et de l'eau, et donnees de surveillance environnementale.",
  },
  immigration: {
    name: "Immigration",
    shortName: "Immigration",
    description: "Etablissement des nouveaux arrivants et changement demographique.",
    longDescription:
      "Population immigrante, arrivees recentes, pays d'origine et indicateurs des services d'etablissement.",
  },
  "community-services": {
    name: "Services communautaires",
    shortName: "Services",
    description:
      "Services sociaux, infrastructure et soutiens communautaires.",
    longDescription:
      "Disponibilite des programmes communautaires, services sociaux, installations recreatives et infrastructure publique.",
  },
  weather: {
    name: "Meteo",
    shortName: "Meteo",
    description: "Donnees saisonnieres et evenements meteorologiques extremes.",
    longDescription:
      "Donnees meteorologiques historiques, normales de temperature, neige, precipitation et evenements meteorologiques extremes.",
  },
};

export function translateCategory(category: Category, locale: Locale): Category {
  if (locale !== "fr") return category;
  return {
    ...category,
    ...CATEGORY_TRANSLATIONS[category.slug],
  };
}

const FREQUENCY_TRANSLATIONS: Record<Indicator["updateFrequency"], string> = {
  Annual: "Annuelle",
  Quarterly: "Trimestrielle",
  Monthly: "Mensuelle",
  Weekly: "Hebdomadaire",
  Daily: "Quotidienne",
  Irregular: "Irreguliere",
};

const UNIT_TRANSLATIONS: Record<Indicator["unit"], string> = {
  CAD: "dollars canadiens",
  "%": "%",
  persons: "personnes",
  count: "nombre",
  index: "indice",
  years: "annees",
  days: "jours",
};

const SOURCE_TRANSLATIONS: Record<string, string> = {
  "Statistics Canada": "Statistique Canada",
  "Statistics Canada - Population estimates":
    "Statistique Canada - estimations demographiques",
  "Statistics Canada - 2021 Census Profile":
    "Statistique Canada - Profil du Recensement de 2021",
  "Statistics Canada - 2021 Census household size":
    "Statistique Canada - taille des menages, Recensement de 2021",
  "Statistics Canada - NHS/Census owner-estimated dwelling value":
    "Statistique Canada - valeur estimee des logements, ENM/Recensement",
  "CMHC via Statistics Canada - housing starts":
    "SCHL via Statistique Canada - mises en chantier",
  "CMHC via Statistics Canada - rental vacancy rates":
    "SCHL via Statistique Canada - taux d'inoccupation locative",
  "CMHC via Statistics Canada - average rents":
    "SCHL via Statistique Canada - loyers moyens",
  "Statistics Canada / CMHC - 2021 Census core housing need":
    "Statistique Canada / SCHL - besoins imperieux en logement, Recensement de 2021",
  "Statistics Canada - 2021/2016 Census housing indicators by tenure":
    "Statistique Canada - indicateurs du logement selon le mode d'occupation, Recensements de 2021/2016",
  "Sault Area Hospital (Luma)": "Sault Area Hospital (Luma)",
  "Ontario Ministry of Health - MOHSERLO":
    "Ministere de la Sante de l'Ontario - MOHSERLO",
  "Canadian Institute for Health Information":
    "Institut canadien d'information sur la sante",
  "Environment and Climate Change Canada - historical climate data":
    "Environnement et Changement climatique Canada - donnees climatiques historiques",
  "Environment and Climate Change Canada (illustrative)":
    "Environnement et Changement climatique Canada (illustratif)",
  "Independent Electricity System Operator (illustrative)":
    "Societe independante d'exploitation du reseau d'electricite (illustratif)",
  "Statistics Canada - 2021 Census place of birth":
    "Statistique Canada - lieu de naissance, Recensement de 2021",
  "Ontario Public Library Statistics (illustrative)":
    "Statistiques des bibliotheques publiques de l'Ontario (illustratif)",
  "Local transit agency data (illustrative)":
    "Donnees d'agence locale de transport en commun (illustratif)",
  "Compiled service directory (illustrative)":
    "Repertoire de services compile (illustratif)",
};

const SOURCE_PHRASES: Array<[string, string]> = [
  ["Statistics Canada", "Statistique Canada"],
  ["Labour Force Survey", "Enquete sur la population active"],
  ["Census of Population", "Recensement de la population"],
  ["Canadian Community Health Survey", "Enquete sur la sante dans les collectivites canadiennes"],
  ["Business Register", "Registre des entreprises"],
  ["Provincial economic accounts", "Comptes economiques provinciaux"],
  ["National Occupational Classification wage data", "donnees salariales de la Classification nationale des professions"],
  ["Life Tables", "tables de mortalite"],
  ["General Social Survey", "Enquete sociale generale"],
  ["Environment and Climate Change Canada", "Environnement et Changement climatique Canada"],
  ["illustrative", "illustratif"],
  ["allocated", "attribue"],
];

const LICENSE_TRANSLATIONS: Record<string, string> = {
  "Statistics Canada Open Licence": "Licence ouverte de Statistique Canada",
  "Open Government Licence - Canada": "Licence du gouvernement ouvert - Canada",
  "Placeholder — real dataset to be ingested":
    "Espace reserve - jeu de donnees reel a integrer",
  "Placeholder â€” real dataset to be ingested":
    "Espace reserve - jeu de donnees reel a integrer",
};

type IndicatorText = Pick<
  Indicator,
  "name" | "description" | "methodology"
> & {
  source?: string;
  license?: string;
  compositionCategories?: string[];
};

const INDICATOR_TRANSLATIONS: Record<string, IndicatorText> = {
  "total-population": {
    name: "Population totale",
    description:
      "Population residente totale declaree dans le Recensement de la population.",
    source: "Statistique Canada - estimations demographiques",
    methodology:
      "Les chiffres de population proviennent du Recensement de la population quinquennal. Les annees intercensitaires sont interpolees lineairement pour l'affichage seulement.",
  },
  "median-age": {
    name: "Age median",
    description:
      "L'age qui divise la population en deux groupes de taille egale.",
    source: "Statistique Canada - Profil du Recensement de 2021",
    methodology:
      "L'age median est calcule a partir des repartitions par age simple dans le Recensement.",
  },
  "population-growth-rate": {
    name: "Taux de croissance de la population",
    description:
      "Variation annuelle de la population residente totale.",
    source: "Statistique Canada - estimations demographiques",
    methodology:
      "Variation annuelle en pourcentage de la population, calculee a partir des estimations au 1er juillet.",
  },
  "household-size": {
    name: "Taille moyenne des menages",
    description: "Nombre moyen de personnes par menage prive.",
    source: "Statistique Canada - taille des menages, Recensement de 2021",
    methodology:
      "La taille moyenne des menages est le nombre de personnes dans les menages prives divise par le nombre de menages prives occupes pour chaque geographie.",
  },
  "age-distribution": {
    name: "Repartition par age",
    description: "Repartition de la population par groupe d'age.",
    source: "Statistique Canada - Profil du Recensement de 2021",
    methodology:
      "Population agee de 0 an et plus, repartie selon les groupes d'age standards du Recensement.",
  },
  "median-household-income": {
    name: "Revenu median des menages",
    description:
      "Valeur mediane du revenu apres impot des menages pour tous les menages prives.",
    source: "Statistique Canada - Profil du Recensement de 2021",
    methodology:
      "Le revenu apres impot est declare en dollars constants de 2020.",
  },
  "business-count": {
    name: "Entreprises actives",
    description: "Nombre d'entreprises employeuses actives par geographie.",
    source: "Statistique Canada - Registre des entreprises",
    methodology:
      "Le compte comprend les entreprises employeuses ayant au moins un employe remunere pendant la periode de reference.",
  },
  "low-income-rate": {
    name: "Taux de faible revenu",
    description:
      "Part de la population vivant dans des menages a faible revenu apres impot.",
    source: "Statistique Canada - Profil du Recensement de 2021",
    methodology:
      "Mesure de faible revenu apres impot (MFR-ApI) : part des personnes dans des menages sous 50 % du revenu median national apres impot.",
  },
  "gdp-per-capita": {
    name: "PIB par habitant",
    description: "Produit interieur brut par resident.",
    source: "Statistique Canada - comptes economiques provinciaux (attribues)",
    methodology:
      "PIB provincial attribue aux communautes selon la part de la population active, puis declare par habitant.",
  },
  "industry-employment": {
    name: "Emploi par industrie",
    description:
      "Part de l'emploi total dans les grands secteurs industriels.",
    source: "Statistique Canada - Enquete sur la population active",
    methodology:
      "Emploi moyen sur les 12 mois de l'annee de reference, reparti selon les groupes de secteurs SCIAN.",
    compositionCategories: [
      "Production de biens",
      "Commerce et transport",
      "Sante et education",
      "Administration publique",
      "Services professionnels",
      "Autres services",
    ],
  },
  "unemployment-rate": {
    name: "Taux de chomage",
    description:
      "Pourcentage de la population active agee de 15 ans et plus qui est au chomage.",
    source: "Statistique Canada - Enquete sur la population active",
    methodology:
      "Nombre de personnes au chomage divise par la population active agee de 15 ans et plus.",
  },
  "employment-rate": {
    name: "Taux d'emploi",
    description:
      "Part de la population en age de travailler qui occupe un emploi.",
    source: "Statistique Canada - Enquete sur la population active",
    methodology:
      "Personnes occupees en pourcentage de la population en age de travailler (15 ans et plus).",
  },
  "median-wage-by-occupation": {
    name: "Salaire median par profession",
    description:
      "Salaire annuel median dans les professions classees selon la CNP.",
    source:
      "Statistique Canada - donnees salariales de la Classification nationale des professions",
    methodology:
      "Salaires annuels medians declares par code CNP a 5 chiffres.",
  },
  "labour-force-participation": {
    name: "Taux d'activite",
    description:
      "Part de la population agee de 15 ans et plus dans la population active (personnes occupees + personnes cherchant activement un emploi).",
    source: "Statistique Canada - Enquete sur la population active",
    methodology:
      "Population active divisee par la population en age de travailler (15 ans et plus).",
  },
  "average-weekly-earnings": {
    name: "Remuneration hebdomadaire moyenne",
    description: "Remuneration hebdomadaire moyenne des employes.",
    source: "Statistique Canada - EERH",
    methodology:
      "Enquete sur l'emploi, la remuneration et les heures de travail : remuneration hebdomadaire moyenne de tous les employes.",
  },
  "employment-by-class": {
    name: "Emploi selon la categorie de travailleur",
    description:
      "Travailleurs repartis entre employes, travailleurs autonomes et travailleurs familiaux non remuneres.",
    source: "Statistique Canada - Enquete sur la population active",
    methodology:
      "Personnes occupees reparties selon les categories de travailleurs.",
    compositionCategories: [
      "Employes du secteur public",
      "Employes du secteur prive",
      "Travailleurs autonomes constitues en societe",
      "Travailleurs autonomes non constitues en societe",
    ],
  },
  "average-home-price": {
    name: "Valeur moyenne des logements",
    description:
      "Valeur moyenne estimee par les proprietaires des logements prives declaree par Statistique Canada.",
    source:
      "Statistique Canada - valeur estimee des logements, ENM/Recensement",
    methodology:
      "La valeur moyenne des logements correspond a la valeur estimee par les proprietaires pour les logements prives occupes. Les valeurs de 2011 proviennent du Profil de l'Enquete nationale aupres des menages; les valeurs de 2016 et 2021 proviennent des tableaux du Recensement sur la valeur estimee des logements. Ce n'est pas un prix de vente MLS.",
  },
  "housing-starts": {
    name: "Mises en chantier",
    description:
      "Nombre de nouveaux logements residentiels dont la construction a commence pendant la periode.",
    source: "SCHL via Statistique Canada - mises en chantier",
    methodology:
      "Inclut toute nouvelle construction residentielle ou au moins une semelle de fondation a ete posee.",
  },
  "rental-vacancy-rate": {
    name: "Taux d'inoccupation locative",
    description:
      "Part des logements locatifs vacants et disponibles a la location.",
    source: "SCHL via Statistique Canada - taux d'inoccupation locative",
    methodology:
      "Logements vacants divises par l'univers locatif total sonde.",
  },
  "average-monthly-rent": {
    name: "Loyer mensuel moyen (2 chambres)",
    description:
      "Loyer demande moyen pour un appartement de deux chambres.",
    source: "SCHL via Statistique Canada - loyers moyens",
    methodology:
      "Loyer moyen des appartements de deux chambres occupes dans les immeubles sondes.",
  },
  "core-housing-need": {
    name: "Menages ayant des besoins imperieux en logement",
    description:
      "Part des menages qui ne peuvent pas se permettre un logement acceptable ou y acceder.",
    source:
      "Statistique Canada / SCHL - besoins imperieux en logement, Recensement de 2021",
    methodology:
      "Menages sous les normes d'adequation, de convenance ou d'abordabilite qui devraient consacrer 30 % ou plus de leur revenu avant impot au logement local.",
  },
  "housing-tenure": {
    name: "Mode d'occupation du logement",
    description:
      "Part des menages proprietaires par rapport aux menages locataires.",
    source:
      "Statistique Canada - indicateurs du logement selon le mode d'occupation, Recensements de 2021/2016",
    methodology:
      "Les parts selon le mode d'occupation sont calculees a partir des comptes de menages prives de Statistique Canada par mode d'occupation pour chaque geographie et chaque annee de recensement.",
    compositionCategories: ["Proprietaires", "Locataires", "Logement de bande"],
  },
  "ed-wait-time-average": {
    name: "Temps d'attente moyen aux urgences",
    description:
      "Temps d'attente moyen au service des urgences de Sault Area Hospital.",
    methodology:
      "Temps entre l'inscription du patient et l'evaluation initiale par un medecin, moyenne sur la periode la plus recemment declaree.",
  },
  "health-services-by-type": {
    name: "Services de sante par type",
    description:
      "Nombre de services de sante a Sault Ste. Marie, regroupes par type de service.",
    source: "Ministere de la Sante de l'Ontario - MOHSERLO",
    methodology:
      "Services compiles par l'equipe du projet DATANORTH a partir de repertoires publics.",
  },
  "life-expectancy": {
    name: "Esperance de vie a la naissance",
    description: "Duree de vie moyenne attendue d'un nouveau-ne.",
    methodology:
      "Esperance de vie a la naissance moyenne sur trois ans, sexes combines.",
  },
  "self-rated-health": {
    name: "Sante autoevaluee (bonne ou meilleure)",
    description:
      "Part des residents qui declarent que leur sante est bonne, tres bonne ou excellente.",
    methodology:
      "Etat de sante general autoevalue : part des personnes qui choisissent bonne, tres bonne ou excellente.",
  },
  "physician-supply": {
    name: "Medecins de famille par 10 000",
    description: "Nombre de medecins de famille par 10 000 residents.",
    source: "Institut canadien d'information sur la sante",
    methodology:
      "Medecins de famille actifs selon le lieu principal de pratique, normalises selon la population.",
  },
  "mental-health-rating": {
    name: "Sante mentale autoevaluee",
    description:
      "Part des residents qui declarent une bonne ou excellente sante mentale.",
    methodology:
      "Etat de sante mentale autoevalue : part des personnes qui choisissent bonne, tres bonne ou excellente.",
  },
  "post-secondary-attainment": {
    name: "Diplomation postsecondaire",
    description:
      "Part de la population agee de 25 a 64 ans ayant un titre postsecondaire.",
    methodology:
      "Population agee de 25 a 64 ans ayant un certificat, diplome ou grade superieur au secondaire.",
  },
  "high-school-completion": {
    name: "Achevement des etudes secondaires",
    description:
      "Part de la population agee de 25 ans et plus ayant au moins un diplome d'etudes secondaires.",
    methodology:
      "Population agee de 25 ans et plus ayant un diplome d'etudes secondaires ou l'equivalent, ou un niveau superieur.",
  },
  "university-degree-rate": {
    name: "Taux de diplomation universitaire",
    description:
      "Part de la population agee de 25 a 64 ans ayant un baccalaureat ou un niveau superieur.",
    methodology:
      "Population agee de 25 a 64 ans detenant un titre de niveau baccalaureat ou superieur.",
  },
  "youth-not-in-education-employment": {
    name: "Jeunes ni aux etudes ni en emploi (NEET)",
    description:
      "Part des 15 a 29 ans qui ne travaillent pas et ne sont ni aux etudes ni en formation.",
    methodology:
      "Jeunes de 15 a 29 ans qui ne sont ni employes ni aux etudes ou en formation, en proportion du meme groupe d'age.",
  },
  "highest-education": {
    name: "Plus haut niveau de scolarite",
    description:
      "Population agee de 25 ans et plus repartie selon le plus haut titre obtenu.",
    methodology:
      "Population agee de 25 ans et plus classee selon le plus haut titre obtenu.",
    compositionCategories: [
      "Aucun certificat",
      "Secondaire",
      "Metiers / apprentissage",
      "College",
      "Universite",
    ],
  },
  "annual-mean-temperature": {
    name: "Temperature moyenne annuelle",
    description: "Temperature quotidienne moyenne annuelle de l'air.",
    methodology:
      "Moyenne annuelle des observations quotidiennes de temperature a la station de reference, en degres Celsius.",
  },
  "annual-precipitation": {
    name: "Precipitations annuelles",
    description:
      "Precipitations annuelles totales (pluie + equivalent en eau de la neige).",
    methodology:
      "Somme des valeurs quotidiennes de precipitation sur l'annee civile, en millimetres.",
  },
  "extreme-heat-days": {
    name: "Jours au-dessus de 30 degres C",
    description:
      "Nombre de jours par annee avec une temperature maximale au-dessus de 30 degres C.",
    methodology:
      "Observations quotidiennes de temperature maximale comptees lorsqu'elles depassent 30 degres C.",
  },
  "ghg-emissions-per-capita": {
    name: "Emissions de gaz a effet de serre par habitant",
    description:
      "Tonnes d'emissions en equivalent CO2 par resident.",
    methodology:
      "Inventaire provincial des GES attribue selon la population.",
  },
  "renewable-electricity-share": {
    name: "Part de l'electricite renouvelable",
    description:
      "Part de l'electricite produite a partir de sources renouvelables.",
    methodology:
      "Production annuelle provenant de l'hydro, de l'eolien, du solaire et de la biomasse divisee par la production totale.",
  },
  "immigrant-population": {
    name: "Population immigrante",
    description:
      "Part de la population composee d'immigrants (residents permanents ou ayant obtenu le droit d'etablissement).",
    methodology:
      "Personnes qui sont ou ont deja ete des immigrants recus ou des residents permanents au Canada.",
  },
  "recent-immigrants": {
    name: "Immigrants recents (5 dernieres annees)",
    description:
      "Part de la population devenue residente permanente au cours des 5 dernieres annees.",
    methodology:
      "Residents permanents dont la date d'admission se situe dans les 5 annees precedant la periode de reference.",
  },
  "non-official-language": {
    name: "Langue maternelle non officielle",
    description:
      "Part ayant une langue maternelle autre que l'anglais ou le francais.",
    methodology:
      "Population dont la premiere langue apprise a la maison dans l'enfance n'est ni l'anglais ni le francais.",
  },
  "visible-minority-share": {
    name: "Population de minorite visible",
    description:
      "Part de la population appartenant a un groupe de minorite visible.",
    methodology:
      "Selon la Loi sur l'equite en matiere d'emploi : personnes, autres que les Autochtones, qui ne sont pas de race blanche ou qui n'ont pas la peau blanche.",
  },
  "immigrants-by-region": {
    name: "Immigrants par region d'origine",
    description:
      "Repartition de la population immigrante selon la grande region mondiale de naissance.",
    source: "Statistique Canada - lieu de naissance, Recensement de 2021",
    methodology:
      "Immigrants repartis selon les regions mondiales de naissance des Nations Unies.",
    compositionCategories: [
      "Europe",
      "Asie",
      "Ameriques",
      "Afrique",
      "Oceanie et autres",
    ],
  },
  "library-visits": {
    name: "Visites de bibliotheque publique par habitant",
    description: "Visites annuelles de bibliotheque par resident.",
    methodology:
      "Nombre total de visites annuelles en personne divise par la population de la zone de service.",
  },
  "recreation-participation": {
    name: "Participation aux loisirs",
    description:
      "Part des residents declarant participer chaque semaine a des loisirs organises.",
    methodology:
      "Participation hebdomadaire auto-declaree a toute activite recreative organisee.",
  },
  "volunteer-rate": {
    name: "Taux de benevolat",
    description:
      "Part des residents ages de 15 ans et plus ayant fait du benevolat au cours de la derniere annee.",
    methodology:
      "Personnes agees de 15 ans et plus ayant declare avoir fait du benevolat par l'intermediaire d'un organisme au cours des 12 derniers mois.",
  },
  "transit-availability": {
    name: "Disponibilite du transport en commun",
    description:
      "Part des menages situes a moins de 500 m d'un arret de transport en commun.",
    source: "Donnees d'agence locale de transport en commun (illustratif)",
    methodology:
      "Menages geocodes situes a distance de marche d'un arret de transport en commun.",
  },
  "service-mix": {
    name: "Composition des services communautaires",
    description:
      "Repartition des services destines a la communaute par type.",
    source: "Repertoire de services compile (illustratif)",
    methodology:
      "Inventaire local des services reparti selon les categories fonctionnelles.",
    compositionCategories: [
      "Sante et services sociaux",
      "Loisirs",
      "Education et formation",
      "Culture",
      "Services gouvernementaux",
    ],
  },
  "annual-snowfall": {
    name: "Chutes de neige annuelles",
    description: "Chutes de neige totales enregistrees pendant l'annee.",
    methodology:
      "Somme des observations quotidiennes mesurees de chute de neige, en centimetres.",
  },
  "summer-mean-temp": {
    name: "Temperature moyenne estivale",
    description: "Temperature quotidienne moyenne en juin, juillet et aout.",
    methodology:
      "Moyenne des temperatures quotidiennes observees pendant l'ete meteorologique (juin-aout).",
  },
  "winter-mean-temp": {
    name: "Temperature moyenne hivernale",
    description:
      "Temperature quotidienne moyenne en decembre, janvier et fevrier.",
    methodology:
      "Moyenne des temperatures quotidiennes observees pendant l'hiver meteorologique (decembre-fevrier).",
  },
  "frost-free-days": {
    name: "Jours sans gel",
    description:
      "Nombre de jours par annee avec une temperature minimale superieure a 0 degre C.",
    methodology:
      "Jours par annee civile ou la temperature minimale de l'air est restee au-dessus de 0 degre C.",
  },
  "annual-precipitation-days": {
    name: "Jours avec precipitations mesurables",
    description:
      "Nombre de jours par annee avec pluie ou neige mesurable.",
    methodology:
      "Jours par annee ou la precipitation quotidienne totale est d'au moins 0,2 mm.",
  },
};

function translateSource(source: string, locale: Locale) {
  if (locale !== "fr") return source;
  if (SOURCE_TRANSLATIONS[source]) return SOURCE_TRANSLATIONS[source];
  return SOURCE_PHRASES.reduce(
    (text, [from, to]) => text.replaceAll(from, to),
    source,
  );
}

export function translateFrequency(
  frequency: Indicator["updateFrequency"],
  locale: Locale,
) {
  return locale === "fr" ? FREQUENCY_TRANSLATIONS[frequency] : frequency;
}

export function translateUnit(unit: Indicator["unit"], locale: Locale) {
  return locale === "fr" ? UNIT_TRANSLATIONS[unit] : unit;
}

export function translateLicense(license: string, locale: Locale) {
  return locale === "fr" ? LICENSE_TRANSLATIONS[license] ?? license : license;
}

export function translateCompositionLabel(
  label: string,
  indicatorSlug: string,
  locale: Locale,
) {
  if (locale !== "fr") return label;
  const base = INDICATOR_TRANSLATIONS[indicatorSlug]?.compositionCategories;
  if (!base) return label;
  return base[labelIndex(indicatorSlug, label)] ?? label;
}

function labelIndex(indicatorSlug: string, label: string) {
  const english = ENGLISH_COMPOSITION_LABELS[indicatorSlug] ?? [];
  const index = english.indexOf(label);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

const ENGLISH_COMPOSITION_LABELS: Record<string, string[]> = {
  "age-distribution": ["0–14", "15–24", "25–44", "45–64", "65+"],
  "industry-employment": [
    "Goods-producing",
    "Trade & transport",
    "Health & education",
    "Public administration",
    "Professional services",
    "Other services",
  ],
  "employment-by-class": [
    "Public-sector employees",
    "Private-sector employees",
    "Self-employed (incorporated)",
    "Self-employed (unincorporated)",
  ],
  "housing-tenure": ["Owner", "Renter", "Band housing"],
  "highest-education": [
    "No certificate",
    "High school",
    "Trades / apprenticeship",
    "College",
    "University",
  ],
  "immigrants-by-region": [
    "Europe",
    "Asia",
    "Americas",
    "Africa",
    "Oceania & other",
  ],
  "service-mix": [
    "Health & social",
    "Recreation",
    "Education & training",
    "Cultural",
    "Government services",
  ],
};

export function translateIndicator(
  indicator: Indicator,
  locale: Locale,
): Indicator {
  if (locale !== "fr") return indicator;
  const translated = INDICATOR_TRANSLATIONS[indicator.slug];
  return {
    ...indicator,
    name: translated?.name ?? indicator.name,
    description: translated?.description ?? indicator.description,
    source: translated?.source ?? translateSource(indicator.source, locale),
    methodology: translated?.methodology ?? indicator.methodology,
    license: translated?.license ?? translateLicense(indicator.license, locale),
    updateFrequency: translateFrequency(
      indicator.updateFrequency,
      locale,
    ) as Indicator["updateFrequency"],
    compositionCategories:
      translated?.compositionCategories ?? indicator.compositionCategories,
  };
}

export function translateIndicators(
  indicators: Indicator[],
  locale: Locale,
): Indicator[] {
  return locale === "fr"
    ? indicators.map((indicator) => translateIndicator(indicator, locale))
    : indicators;
}

export function translateGeography(
  geography: Geography,
  locale: Locale,
): Geography {
  if (locale !== "fr") return geography;
  if (geography.code === "NORTHERN-ON") {
    return { ...geography, name: "Nord de l'Ontario" };
  }
  return geography;
}
