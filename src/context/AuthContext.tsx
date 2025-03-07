'use client'
import { getCurrentUser, login, validateGoogleToken } from "@/helpers/auth.helper";
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
                validateGoogleToken(googleToken)

                    .then((response) => {

                        setUserData({
                            token: response.token, //token devuelto por back
                            user: {
                                id: response.userId,
                                name: response.userName,
                                email: response.email,
                            },
                        });

                        Cookies.set("token", response.token, { expires: 7, secure: true });
                        Cookies.set("nutriflowUser", JSON.stringify(response.user), { expires: 7, secure: true });
                        
                        router.push("/home");
                    });
            } 
        }
        console.log("saliendo")
    }, [session]);

    //cuando el usuario se loguea de forma manual, guardamos en cookies
    useEffect (() => {
        console.log("entro a setear cookies")
        if(userData){
            console.log("seteando cookies")
            Cookies.set("token",userData.token, { expires: 7, secure: true });
            Cookies.set("nutriflowUser", JSON.stringify(userData.user), { expires: 7, secure: true });
        }
    }, [userData])

    //el usuario entra tiempo despues y la app lee las cookies y da el acceso
    useEffect(() => {
        console.log("leyendo cookies")
        const nutriflowUser = Cookies.get("nutriflowUser");
        const token = Cookies.get("token");
        if (nutriflowUser && token){
            console.log("existen cookies") 
            setUserData({
                token: token,
                user: JSON.parse(nutriflowUser)
            });
        } else {
            router.push("/");
        }
    }, [])  
     
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
        <AuthContext.Provider value={{ userData, setUserData, loginWithGoogle, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);