"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInButton(){
    return(
        <button onClick={() => signIn('google')} className="flex items-center gap-4 shadow-xl rounded-l pl-3">
        <Image src="/googlelogo.png" height={40} width={40}/>
        <span className="bg-blue-500 text-white px-4 py-3">Sign in with Google</span>
        </button>
    );
}