import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
        .from("score")
        .insert([{ userId: body.userId, score: body.score }])
        .select();
    if (error) console.log(error);
    if (data) {
        return Response.json(data);
    }
    console.log(data, error);

    if (error) {
        console.log(error.message);
        return Response.json(error);
    }
    if (data) {
        return Response.json(data);
    }
}
