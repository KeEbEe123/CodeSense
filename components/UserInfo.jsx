"use client";

import Image from "next/image";
import SignInButton from "./SignInButton";
import { useSession } from "next-auth/react";

export default function UserInfo(){
        const {status, data:session} = useSession();
        if (status === "authenticated"){
            return (
            <div className="shadow-xl p-8 rounded-md flex flex-col gap-3 bg-yellow-200">
                <div>
                    <Image className="rounded-full" src={session?.user?.image} width={60} height={60}/>
                </div>
                <div>
                    <span>
                        Name: {session?.user?.name}
                    </span>
                </div>
                <div>
                    <span>
                        Email: {session?.user?.email}
                    </span>
                </div>
                <div>
                    <span>
                        
                    </span>
                </div>
            </div>
            );
        }else{ return <SignInButton/>}
}