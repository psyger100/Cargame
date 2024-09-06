import { whoIs } from "@/actions/users";
import Car from "@/components/car";
import Game from "@/components/Game";

interface userInformationType {
    id: string;
    created_at: string;
    name: string;
    email: string;
}
export default async function game({ params }: any) {
    const userInfomation = await whoIs(params.userId);
    return (
        <div className="flex items-center justify-center flex-col">
            {/* @ts-ignore */}
            <p>user id: {userInfomation[0].name}</p>
            <Car />
            {/* <Game /> */}
        </div>
    );
}
