"use client";

import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar(){
    
    const {status} = useSession();
    return(
        <div className="flex p-4 justify-between shadow-md">
            <Link className="font-bold text-lg text-blue-700" href="/">Codesense</Link>
            {status === "authenticated" ? (
            <button onClick={()=>signOut()} className="bg-slate-900 text-white px-6 py-2 rounded">Sign Out</button>
            ) : (
            <button onClick={()=>signIn('google')} className="bg-slate-900 text-white px-6 py-2 rounded">Sign In</button>
            )
            } 
        </div>
    );
}