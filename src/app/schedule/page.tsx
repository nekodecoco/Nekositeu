import { createClient } from "@/lib/supabase/server";
import type { ScheduleBlockRow } from "@/lib/supabase/types";
import ScheduleClient from "./ScheduleClient";
import ScheduleLocked from "./ScheduleLocked";

export default async function SchedulePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Private page: anonymous visitors get the locked state and no schedule
  // data is fetched or serialized. RLS on schedule_blocks is the backstop.
  if (!user) {
    return <ScheduleLocked />;
  }

  const { data } = await supabase
    .from("schedule_blocks")
    .select("*")
    .order("day_index")
    .order("row_start")
    .overrideTypes<ScheduleBlockRow[], { merge: false }>();

  return <ScheduleClient blocks={data ?? []} />;
}
