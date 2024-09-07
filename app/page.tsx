import SignOutButton from "@/components/SignOutButton";
import { getUser } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
    // const user = await getUser();
    return (
        <div>
            <Link
                href={`/game/7e3a67dd-fc63-4c4a-ba26-bcceeddf8d2c`}
                className="bg-emerald-700 p-2"
            >
                playgame
            </Link>
            {/* {user ? (
                <>
                    <div className="flex flex-col w-full">
                        <SignOutButton />
                    </div>
                </>
            ) : (
                <div>
                    <Link href={"/login"} className="bg-emerald-700 p-2">
                        Login
                    </Link>
                </div>
            )} */}
        </div>
    );
}
