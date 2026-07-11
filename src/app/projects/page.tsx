import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .overrideTypes<ProjectRow[], { merge: false }>();

  return <ProjectsClient projects={data ?? []} />;
}
