import { getUser } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
    const user = await getUser();

    return (
        <div>
            {user ? (
                <>
                    <Link href={`/game/${user.id}`} className="bg-emerald-700 p-2">
                        playgame
                    </Link>
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
