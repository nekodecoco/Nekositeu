"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Upload an image to a public bucket from the browser (Server Actions have a
 * small request-body limit) and return its public URL.
 */
export async function uploadPublicImage(
  bucket: string,
  pathPrefix: string,
  file: File
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}
