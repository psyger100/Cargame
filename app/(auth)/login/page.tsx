"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/users";
import Link from "next/link";

export default function SignInForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const { errorMessage } = await loginAction(formData);
            if (errorMessage) {
                console.log(errorMessage);
            } else {
                router.push("/");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90  bg-center overscroll-none">
            <div className="bg-gray-800 px-12 py-8 rounded-lg shadow-xl w-80 ">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">
                    NEXT GAME
                </h2>
                <h2 className="text-2xl font-bold mb-5 text-orange-400 text-center">
                    login
                </h2>
                <form action={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        className="w-full bg-gray-700 text-white placeholder-gray-400 border-none rounded-full items-center text-center py-2"
                        disabled={isPending}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        className="w-full bg-gray-700 text-white placeholder-gray-400 border-none rounded-full items-center text-center py-2"
                        disabled={isPending}
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-3xl"
                        disabled={isPending}
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href={"/signup"}
                        className="text-orange-500 hover:underline text-sm"
                    >
                        Register now
                    </Link>
                </div>
            </div>
        </div>
    );
}
