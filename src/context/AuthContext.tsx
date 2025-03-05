'use client'
import { registerWithGoogle } from "@/helpers/auth.helper";
import { AuthContextProps, IUserSession } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useState, useEffect, createContext, useContext } from "react"

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
    const router = useRouter();
    const {data:session, status} = useSession();
    const[userData, setUserData] = useState<IUserSession | null> (null)

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            
            const googleToken = session?.accessToken;
            console.log(session.user)
                                               
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
                        router.push("/home");
                    });
            }    
        } else {
            
            const storedUser = localStorage.getItem("userSession");
            
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            } else {
                setUserData(null);
            }
        }
    }, [session, status,router]);

    const loginWithEmail = (user: IUserSession) => {
        setUserData(user);
        localStorage.setItem("userSession", JSON.stringify(user));
    };

    const logout = () => {
        localStorage.removeItem("userSession");
        setUserData(null);
        signOut();
    };

    const loginWithGoogle = async () => {
        try {
          const result = await signIn("google");
          if (result?.error) {
            console.error("Error durante el login con Google:", result.error);
            return;
          }
    
        router.push("/home");

        } catch (error) {
          console.error("Error en loginWithGoogle:", error);
        }
      };
    
    return (
        <AuthContext.Provider value={{userData, setUserData, loginWithGoogle: () => signIn("google"),loginWithEmail,logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);