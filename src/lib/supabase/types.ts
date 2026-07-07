// Row types mirroring supabase/migrations/001_init.sql

export type ProjectStatus = "LIVE" | "PROGRESS" | "ARCHIVED";
export type BlockColor = "blue" | "orange" | "peach" | "gray";

export interface CatRow {
  id: string; // text id ("c1"…) so existing /cats/[id] URLs keep working
  resident_number: string;
  name: string;
  breed: string;
  arrival_date: string; // human-readable, e.g. "June 12, 2021"
  birthday: string; // ISO date
  description: string;
  personality: string;
  gradient_from: string;
  gradient_to: string;
  created_at: string;
}

export interface CatPhotoRow {
  id: string;
  cat_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface CafeRow {
  id: string;
  name: string;
  rating: number;
  tags: string[];
  visit_date: string; // ISO date
  journal: string;
  created_at: string;
}

export interface CafePhotoRow {
  id: string;
  cafe_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  tech_tags: string[];
  live_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface ScheduleBlockRow {
  id: string;
  day_index: number; // 0 (Mon) – 6 (Sun)
  title: string;
  subtitle: string | null;
  start_hour: string; // "09:00"
  end_hour: string; // "11:00"
  row_start: number;
  row_end: number;
  color_type: BlockColor;
  status: string | null;
  created_at: string;
}
