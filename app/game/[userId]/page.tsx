import { whoIs } from "@/actions/users";
import Game from "@/components/GameCanvas";

interface userInformationType {
    id: string;
    created_at: string;
    name: string;
    email: string;
}
export default async function game({ params }: any) {
    const userInfomation = await whoIs(params.userId);
    return (
        <div className="flex items-center flex-col w-full overflow-hidden">
            {/* @ts-ignore */}
            {/* <p>user id: {userInfomation[0].name}</p> */}

            <Game />
        </div>
    );
}
