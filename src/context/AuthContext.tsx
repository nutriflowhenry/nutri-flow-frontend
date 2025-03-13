'use client'
import { validateGoogleToken, fetchUserProfile, getCurrentUser } from "@/helpers/auth.helper";
import { AuthContextProps, IUserSession, IUserProfile } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react"
import Cookies from 'js-cookie';

export const AuthContext = createContext<AuthContextProps>({
    userData: null,
    userProfile: null,
    setUserData: () => { },
    setUserProfile: () => { },
    loginWithGoogle: () => { },
    logout: () => { },
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<IUserSession | null>(null);
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);

    useEffect(() => {
        if (status === "authenticated" && session?.user) {

            const googleToken = session?.accessToken;

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
                        const nutriflowUser = response.user;

                        Cookies.set("token", response.token, { expires: 7, secure: true });
                        Cookies.set("nutriflowUser", JSON.stringify(nutriflowUser), { expires: 7, secure: true });

                        if (nutriflowUser.userProfile === null) {
                            router.push("/physical-form");
                        } else {
                            router.push("/home");
                        }
                    });
            }
        }
    }, [session]);

    //cuando el usuario se loguea de forma manual, guardamos en cookies
    useEffect(() => {
        if (userData) {
            Cookies.set("token", userData.token, { expires: 7, secure: true });
            Cookies.set("nutriflowUser", JSON.stringify(userData.user), { expires: 7, secure: true });
        }
    }, [userData])

    //el usuario entra tiempo despues y la app lee las cookies y da el acceso
    useEffect(() => {
        const userJson = Cookies.get("nutriflowUser");
        const nutriflowUser = userJson? JSON.parse(userJson) : null;
        const token = Cookies.get("token");
        
        if (nutriflowUser && token) {
            setUserData({
                token: token,
                user: nutriflowUser,
            });

            // Obtener el perfil del usuario si existe
            fetchUserProfile(token)
            .then((profileData: IUserProfile) => {
                setUserProfile(profileData); // Actualizar el estado del perfil
            })
            .catch((error) => {
                console.error("Error al obtener el perfil del usuario:", error);
                router.push("/physical-form");
            });
            
            //verificar si el usuario ya completó su perfil
            if (nutriflowUser.userProfile === null && nutriflowUser.role !== "admin") {
                console.log("El usuario no tiene perfil y no es admin");
                    router.push("/physical-form");
                if(nutriflowUser.role == "admin"){
                    return router.push("/dashboardAdmin");
                }
            } else {
                router.push("/home");
            }
        } else {
            console.log("No se encontró usuario o token.");
        }
    }, []);

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("nutriflowUser");
        setUserData(null);
        setUserProfile(null);
        signOut();
        router.push("/");
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
        <AuthContext.Provider value={{ userData, userProfile, setUserData, setUserProfile, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);