import { NextResponse } from "next/server";
import { createClient as createServer } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {
  const supabase = await createServer();
  try {
    const { title, content } = await request.json();

    // 현재 인증된 사용자의 ID 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("prompts").insert({
      user_id: user.id,
      title,
      content,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating prompt:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
