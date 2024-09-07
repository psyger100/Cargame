import { whoIs } from "@/actions/users";
import Game from "@/components/GameCanvas";
import { getUser } from "@/lib/auth";
import Link from "next/link";

interface userInformationType {
    id: string;
    created_at: string;
    name: string;
    email: string;
}
export default async function game({ params }: any) {
    const userInfomation = await whoIs(params.userId);
    // const user = await getUser();

    return (
        <div className="flex items-center flex-col w-full overflow-hidden">
            <Game
                userId={params.userId}
                // @ts-ignore
                displayName={userInfomation?.[0]?.name ?? "Guest"}
            />
        </div>
    );
}
