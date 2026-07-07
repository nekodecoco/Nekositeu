"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error?: string };

// Server Functions are reachable via direct POST — always re-verify auth here.
// RLS is the second line of defense.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null } as const;
  return { supabase } as const;
}

/** Derive the storage object path from a public URL. */
function storagePathFromUrl(imageUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(imageUrl.slice(idx + marker.length));
}

export async function addCatPhoto(
  catId: string,
  imageUrl: string,
  caption: string
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase.from("cat_photos").insert({
    cat_id: catId,
    image_url: imageUrl,
    caption: caption.trim() || null,
  });
  if (error) return { error: error.message };

  revalidatePath(`/cats/${catId}`);
  return {};
}

export async function updateCatPhotoCaption(
  photoId: string,
  catId: string,
  caption: string
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase
    .from("cat_photos")
    .update({ caption: caption.trim() || null })
    .eq("id", photoId);
  if (error) return { error: error.message };

  revalidatePath(`/cats/${catId}`);
  return {};
}

export async function deleteCatPhoto(
  photoId: string,
  catId: string,
  imageUrl: string
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!supabase) return { error: "Not authorized." };

  const { error } = await supabase.from("cat_photos").delete().eq("id", photoId);
  if (error) return { error: error.message };

  // Best-effort cleanup of the storage object; the DB row is already gone.
  const path = storagePathFromUrl(imageUrl, "cat-photos");
  if (path) {
    await supabase.storage.from("cat-photos").remove([path]);
  }

  revalidatePath(`/cats/${catId}`);
  return {};
}
