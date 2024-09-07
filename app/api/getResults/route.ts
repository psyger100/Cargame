import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
    );
    try {
        // get date in decending order of time created like 1 to 10
        const { data, error } = await supabase
            .from("score")
            .select("*")
            .eq("userId", body.userId)
            .order("score", { ascending: true });
        if (error) return Response.json(error);

        return Response.json(data);
    } catch (error: any) {
        console.error("Error fetching scores:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
