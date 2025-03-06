'use client'
import { registerWithGoogle } from "@/helpers/auth.helper";
import { AuthContextProps, IUserSession } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext<AuthContextProps>({
    userData: null,
    setUserData: () => { },
    loginWithGoogle: () => { },
    loginWithEmail: () => { },
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
        if (status === "authenticated" && session?.user) {
            // Si el usuario está autenticado con Google
            const googleToken = session.accessToken;
            if (googleToken) {
                registerWithGoogle(googleToken)
                    .then((response) => {
                        const userSession = {
                            token: response.token, //token devuelto por back
                            user: {
                                id: response.userId,
                                name: response.userName,
                                email: response.email,
                            },
                        }
                        setUserData(userSession);
                        Cookies.set("token", JSON.stringify(userSession));
                        // router.push("/dashboard");
                    })
                    .catch((error) => {
                        console.error("Error en autenticación con Google:", error);
                    });
            }
        } else {
            // Verificar si hay una sesión almacenada en cookies
            const storedUser = Cookies.get("token");
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            } else {
                setUserData(null);
            }
        }
    }, [session, status, router]);

    const loginWithEmail = async (user: IUserSession) => {
        setUserData(user);
        Cookies.set("token", JSON.stringify(user)); // Guardado en cookies
    };

    const logout = () => {
        Cookies.remove("token"); // Eliminar la cookie
        setUserData(null);
        signOut();
        router.push("/login");
    };

    const loginWithGoogle = async () => {
        try {
            await signIn("google");
        } catch (error) {
            console.error("Error en loginWithGoogle:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            userData, setUserData, loginWithGoogle, loginWithEmail, logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);