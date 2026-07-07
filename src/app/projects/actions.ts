"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/lib/supabase/types";

type ActionResult = { error?: string };

export interface ProjectInput {
  title: string;
  description: string;
  status: ProjectStatus;
  techTags: string[];
  liveUrl: string;
  featured: boolean;
  sortOrder: number;
}

// Server Functions are reachable via direct POST — always re-verify auth here.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null } as const;
  return { supabase } as const;
}

function toRow(input: ProjectInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status,
    tech_tags: input.techTags,
    // Broad tags drive the filter bar: status + tech stack.
    tags: [input.status, ...input.techTags],
    live_url: input.liveUrl.trim() || null,
    featured: input.featured,
    sort_order: input.sortOrder,
  };
}

export async function addProject(input: ProjectInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase.from("projects").insert(toRow(input));
  if (error) return { error: error.message };

  revalidatePath("/projects");
  return {};
}

export async function updateProject(
  projectId: string,
  input: ProjectInput
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase
    .from("projects")
    .update(toRow(input))
    .eq("id", projectId);
  if (error) return { error: error.message };

  revalidatePath("/projects");
  return {};
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) return { error: error.message };

  revalidatePath("/projects");
  return {};
}
