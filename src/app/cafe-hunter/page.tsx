import { createClient } from "@/lib/supabase/server";
import CafeHunterClient, { type CafeWithPhotos } from "./CafeHunterClient";

export default async function CafeHunterPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cafes")
    .select("*, cafe_photos(*)")
    .order("visit_date", { ascending: false })
    .overrideTypes<CafeWithPhotos[], { merge: false }>();

  return <CafeHunterClient cafes={data ?? []} />;
}
