import SignOutButton from "@/components/SignOutButton";
import { getUser } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
    const user = await getUser();

    return (
        <div>
            {user ? (
                <>
                    <div className="flex flex-col w-full">
                        <Link href={`/game/${user.id}`} className="bg-emerald-700 p-2">
                            playgame
                        </Link>
                        <SignOutButton />
                    </div>
                </>
            ) : (
                <div>
                    <Link href={"/login"} className="bg-emerald-700 p-2">
                        Login
                    </Link>
                </div>
            )}
        </div>
    );
}
