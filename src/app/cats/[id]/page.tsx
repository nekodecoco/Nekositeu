import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CatRow, CatPhotoRow } from "@/lib/supabase/types";
import CatProfileClient from "./CatProfileClient";

export default async function CatProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [catResult, photosResult] = await Promise.all([
    supabase.from("cats").select("*").eq("id", id).maybeSingle<CatRow>(),
    supabase
      .from("cat_photos")
      .select("*")
      .eq("cat_id", id)
      .order("created_at", { ascending: false })
      .overrideTypes<CatPhotoRow[]>(),
  ]);

  const cat = catResult.data;
  if (!cat) notFound();

  return <CatProfileClient cat={cat} photos={photosResult.data ?? []} />;
}
