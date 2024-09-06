"use server";

import { getServerActionAuth, protectAction } from "@/lib/auth";
import { createClient, PostgrestError } from "@supabase/supabase-js";

export const loginAction = async (formData: FormData) => {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const auth = getServerActionAuth();

        const { data, error } = await auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        if (!data.session) throw new Error("No session");

        return { errorMessage: null };
    } catch (error) {
        let errorMessage = "An error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { errorMessage };
    }
};

export const signOutAction = async () => {
    try {
        await protectAction();
        const auth = getServerActionAuth();
        const { error } = await auth.signOut();
        if (error) throw error;

        return { errorMessage: null };
    } catch (error) {
        let errorMessage = "An error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { errorMessage };
    }
};

export async function signUpNewUser(formData: FormData) {
    const auth = getServerActionAuth();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await auth.signUp({
        email: email,
        password: password,
    });
    if (error) throw error;
    if (data) {
        setProfile(data.user.id, data.user.email);
    }
    return data;
}
export async function getTableData() {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase.from("profile").select();
}

export async function setProfile(userid: string, email: string) {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase
        .from("profile")
        .insert([{ id: userid, email: email, displayName: "ravi" }])
        .select();

    if (error) {
        if (error) {
            console.error("Supabase error:", error.message, error.details);
        } else {
            console.error("Unknown error:", error);
        }
    } else if (data) {
        console.log(data);
    }
}
export async function whoIs(userId: string) {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase.from("profile").select().eq("id", userId);
    if (error) throw error;

    if (data) {
        return data;
    }
}
