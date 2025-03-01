'use client'
import { IUserSession } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react"

export interface AuthContextProps {
    userData: IUserSession | null;
    setUserData: (userData: IUserSession | null) => void;
    loginWithGoogle: () => void;
    loginWithEmail: (user: IUserSession) => void;
    logout: () => void;
}

export const AuthContext = createContext <AuthContextProps>({
    userData: null,
    setUserData: () => {},
    loginWithGoogle: () => {},
    loginWithEmail: () => {},
    logout: () =>{},
});

export interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const {data:session, status} = useSession();
    const[userData, setUserData] = useState<IUserSession | null> (null)

    useEffect (() => {
        if (status === "authenticated" && session?.user) {
            console.log("Sesión de NextAuth:", session);

            const googleToken = session.accessToken as string;
            console.log("token de gooogle:", googleToken);

            // const userSession = registerWithGoogle(googleToken);
            // console.log("Respuesta del backend:", userSession);

            setUserData({
              token: session.accessToken as string,
              user: {
                id: (session.user as any)?.id || 0,
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
             },
            });
        } else {
            const storedUser = localStorage.getItem("userSession");
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            } else {
                setUserData(null);
            }
        }
    }, [session, status]);

    const loginWithEmail = (user: IUserSession) => {
        setUserData(user);
        localStorage.setItem("userSession", JSON.stringify(user));
    };

    const logout = () => {
        localStorage.removeItem("userSession");
        setUserData(null);
        signOut();
    };
    
    return (
        <AuthContext.Provider value={{userData, setUserData, loginWithGoogle: () => signIn("google"),loginWithEmail,logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);