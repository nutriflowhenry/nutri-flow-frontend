'use client'
import { registerWithGoogle } from "@/helpers/auth.helper";
import { AuthContextProps, IUserSession } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useState, useEffect, createContext, useContext } from "react"
import Cookies from 'js-cookie';


export const AuthContext = createContext<AuthContextProps>({
    userData: null,
    setUserData: () => { },
    loginWithGoogle: () => { },
    logout: () => { },
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<IUserSession | null>(null)

    useEffect(() => { 
        console.log("iniciando")

        if (status === "authenticated" && session?.user) {
            console.log("autenticado...")
            
            const googleToken = session?.accessToken;
            console.log("autenticado google" + session.user)

            if (googleToken) {
                registerWithGoogle(googleToken)

                    .then((response) => {

                        setUserData({
                            token: response.token, //token devuelto por back
                            user: {
                                id: response.userId,
                                name: response.userName,
                                email: response.email,
                            },
                        });

                        Cookies.set("token", JSON.stringify(response.token), { expires: 7, secure: true });
                        Cookies.set("nutriflowUser", JSON.stringify(response.user), { expires: 7, secure: true });
                        
                        router.push("/home");
                    });
            } 
        }
        console.log("saliendo")
    }, [session, status, router]);

    const logout = () => {
        Cookies.remove("token");
        setUserData(null);
        signOut();
        router.push("/login");
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signIn("google");
            if (result?.error) {
                console.error("Error durante el login con Google:", result.error);
                return;
            }

        } catch (error) {
            console.error("Error en loginWithGoogle:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            userData, setUserData, loginWithGoogle, logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);