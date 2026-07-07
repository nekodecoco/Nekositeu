"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error?: string };
type AddCafeResult = ActionResult & { id?: string };

export interface CafeInput {
  name: string;
  rating: number;
  tags: string[];
  visitDate: string; // "YYYY-MM-DD"
  journal: string;
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

function storagePathFromUrl(imageUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(imageUrl.slice(idx + marker.length));
}

export async function addCafe(input: CafeInput): Promise<AddCafeResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { data, error } = await supabase
    .from("cafes")
    .insert({
      name: input.name.trim(),
      rating: input.rating,
      tags: input.tags,
      visit_date: input.visitDate,
      journal: input.journal.trim(),
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  revalidatePath("/cafe-hunter");
  return { id: data.id };
}

export async function updateCafe(
  cafeId: string,
  input: CafeInput
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase
    .from("cafes")
    .update({
      name: input.name.trim(),
      rating: input.rating,
      tags: input.tags,
      visit_date: input.visitDate,
      journal: input.journal.trim(),
    })
    .eq("id", cafeId);
  if (error) return { error: error.message };

  revalidatePath("/cafe-hunter");
  return {};
}

export async function deleteCafe(
  cafeId: string,
  photoUrls: string[]
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  // Rows in cafe_photos cascade with the cafe row.
  const { error } = await supabase.from("cafes").delete().eq("id", cafeId);
  if (error) return { error: error.message };

  const paths = photoUrls
    .map((url) => storagePathFromUrl(url, "cafe-photos"))
    .filter((p): p is string => p !== null);
  if (paths.length > 0) {
    await supabase.storage.from("cafe-photos").remove(paths);
  }

  revalidatePath("/cafe-hunter");
  return {};
}

export async function addCafePhoto(
  cafeId: string,
  imageUrl: string
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase
    .from("cafe_photos")
    .insert({ cafe_id: cafeId, image_url: imageUrl });
  if (error) return { error: error.message };

  revalidatePath("/cafe-hunter");
  return {};
}

export async function deleteCafePhoto(
  photoId: string,
  imageUrl: string
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase
    .from("cafe_photos")
    .delete()
    .eq("id", photoId);
  if (error) return { error: error.message };

  const path = storagePathFromUrl(imageUrl, "cafe-photos");
  if (path) {
    await supabase.storage.from("cafe-photos").remove([path]);
  }

  revalidatePath("/cafe-hunter");
  return {};
}
