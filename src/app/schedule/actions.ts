"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BlockColor } from "@/lib/supabase/types";

type ActionResult = { error?: string };

export interface TimeBlockInput {
  dayIndex: number;
  title: string;
  subtitle: string;
  startHour: string;
  endHour: string;
  rowStart: number;
  rowEnd: number;
  colorType: BlockColor;
  status: string;
}

// Server Functions are reachable via direct POST — always re-verify auth here.
// schedule_blocks also has no anon RLS policy at all, so even a bypass
// returns nothing.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null } as const;
  return { supabase } as const;
}

function toRow(input: TimeBlockInput) {
  return {
    day_index: input.dayIndex,
    title: input.title.trim(),
    subtitle: input.subtitle.trim() || null,
    start_hour: input.startHour,
    end_hour: input.endHour,
    row_start: input.rowStart,
    row_end: input.rowEnd,
    color_type: input.colorType,
    status: input.status.trim() || null,
  };
}

export async function addTimeBlock(input: TimeBlockInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase.from("schedule_blocks").insert(toRow(input));
  if (error) return { error: error.message };

  revalidatePath("/schedule");
  return {};
}

export async function updateTimeBlock(
  blockId: string,
  input: TimeBlockInput
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase
    .from("schedule_blocks")
    .update(toRow(input))
    .eq("id", blockId);
  if (error) return { error: error.message };

  revalidatePath("/schedule");
  return {};
}

export async function deleteTimeBlock(blockId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase
    .from("schedule_blocks")
    .delete()
    .eq("id", blockId);
  if (error) return { error: error.message };

  revalidatePath("/schedule");
  return {};
}
