// Shared source of truth for cat data — imported by both the feed and profile pages

export interface CatResident {
  id: string;
  residentNumber: string;
  name: string;
  breed: string;
  /** Human-readable arrival date, e.g. "June 12, 2021" */
  arrivalDate: string;
  /** ISO date string used for birthday display */
  birthday: string;
  description: string;
  personality: string;
  gradientFrom: string;
  gradientTo: string;
}

export const CATS: CatResident[] = [
  {
    id: "c1",
    residentNumber: "RESIDENT 01",
    name: "Shadow",
    breed: "Russian Blue",
    arrivalDate: "June 12, 2021",
    birthday: "2020-03-04",
    description:
      "Obsessive code auditor and desk supervisor. Enjoys heat vents, mechanical keyboard clicks, and swatting at yarn threads during Figma sessions.",
    personality: "Analytical · Stoic · Perpetually unimpressed",
    gradientFrom: "from-zinc-700",
    gradientTo: "to-slate-900",
  },
  {
    id: "c2",
    residentNumber: "RESIDENT 02",
    name: "Marmalade",
    breed: "Ginger Tabby",
    arrivalDate: "October 04, 2019",
    birthday: "2018-07-11",
    description:
      "Head of morale and physical comfort. Specializes in sitting directly on layout specs, loud purring during video calls, and cataloging ambient light patches.",
    personality: "Charismatic · Loud · Emotionally Available",
    gradientFrom: "from-orange-500/30",
    gradientTo: "to-amber-950/80",
  },
  {
    id: "c3",
    residentNumber: "RESIDENT 03",
    name: "Pixel",
    breed: "Calico",
    arrivalDate: "March 15, 2022",
    birthday: "2021-11-22",
    description:
      "Quality assurance manager. Expert in micro-movement tracking, testing structural integrity of cardboard mockups, and general QA tasks around the studio.",
    personality: "Meticulous · Playful · Chronically caffeinated",
    gradientFrom: "from-rose-500/20",
    gradientTo: "to-neutral-900",
  },
];

export function getCatById(id: string): CatResident | undefined {
  return CATS.find((c) => c.id === id);
}

// ─── Photo Feed Types ────────────────────────────────────────────────────────

export interface CatPhoto {
  id: string;
  cat_id: string;
  image_url: string;
  caption?: string;
  created_at: string; // ISO timestamp
}

/** Seed photos shown before the user adds any real ones */
export const SEED_PHOTOS: CatPhoto[] = [
  {
    id: "p1",
    cat_id: "c1",
    image_url: "",
    caption: "Guarding the keyboard at 2 AM",
    created_at: "2024-05-01T22:00:00Z",
  },
  {
    id: "p2",
    cat_id: "c1",
    image_url: "",
    caption: "Supervision approved",
    created_at: "2024-03-14T10:30:00Z",
  },
  {
    id: "p3",
    cat_id: "c2",
    image_url: "",
    caption: "Found the warm patch of sunlight",
    created_at: "2024-04-20T14:00:00Z",
  },
  {
    id: "p4",
    cat_id: "c2",
    image_url: "",
    caption: "Monday motivation",
    created_at: "2024-01-08T09:00:00Z",
  },
  {
    id: "p5",
    cat_id: "c3",
    image_url: "",
    caption: "QA testing the new mousepad",
    created_at: "2024-06-02T16:45:00Z",
  },
  {
    id: "p6",
    cat_id: "c3",
    image_url: "",
    caption: null as unknown as string,
    created_at: "2024-02-28T11:00:00Z",
  },
];
