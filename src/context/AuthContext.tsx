'use client'
import Swal from "sweetalert2";
import { validateGoogleToken, getCurrentUser } from "@/helpers/auth.helper";
import { AuthContextProps, IUserSession } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react"
import Cookies from 'js-cookie';

export const AuthContext = createContext<AuthContextProps>({
    userData: null,
    setUserData: () => { },
    loginWithGoogle: () => { },
    logout: () => { },
    isLoading: true, 
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<IUserSession | null>(null);
    // const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const googleToken = session?.accessToken;

            if (googleToken) {
                setIsLoading(true); // Activar el estado de carga
                validateGoogleToken(googleToken)
                    .then((response) => {

                        getCurrentUser(response.token)
                            .then((respuesta) => {
                                const user = respuesta;
                                setUserData({
                                    token: response.token, //token devuelto por back
                                    user: user
                                });

                                const nutriflowUser = user;

                                Cookies.set("token", response.token, { expires: 7, secure: true });
                                Cookies.set("nutriflowUser", JSON.stringify(nutriflowUser), { expires: 7, secure: true });

                                if (nutriflowUser.userProfile === null) {
                                    router.push("/physical-form");
                                }

                            })
                            .catch((error) => {
                                if (error instanceof Error) {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: error.message || "No se pudo obtener la información del usuario.",
                                    });
                                } else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "Ocurrió un error desconocido al obtener la información del usuario.",
                                    });
                                }
                            })
                            .finally(() => setIsLoading(false)); // Desactivar el estado de 
                    })
                    .catch(async (error) => {
                        if (error instanceof Error) {
                            if (error.message === "inactive_account") {
                                await Swal.fire({
                                    icon: "error",
                                    title: "Cuenta inactiva",
                                    text: "Tu cuenta está inactiva. Por favor, contacta al soporte.",
                                });
                                await signOut(); // Forzar el cierre de sesión después de mostrar la alerta
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error de autenticación",
                                    text: error.message || "Error al validar el token de Google.",
                                });
                            }
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error de autenticación",
                                text: "Ocurrió un error desconocido al validar el token de Google.",
                            });
                        }
                        setIsLoading(false); // Desactivar el estado de carga en caso de error
                    });
            }
        } else {
            setIsLoading(false); // Desactivar el estado de carga si no hay sesión
        }
    }, [session, status]);

    //cuando el usuario se loguea de forma manual, guardamos en cookies
    useEffect(() => {

        if (userData && !session) {
            Cookies.set("token", userData.token, { expires: 7, secure: true });
            Cookies.set("nutriflowUser", JSON.stringify(userData.user), { expires: 7, secure: true });
            if (userData.user.userProfile === null && userData.user.role !== "admin") {
                router.push("/physical-form");
            }
        }
    }, [userData, session])

    //el usuario manual entra tiempo despues y la app lee las cookies y da el acceso
    useEffect(() => {
        if (status === "unauthenticated") {
            const userJson = Cookies.get("nutriflowUser");
            const nutriflowUser = userJson ? JSON.parse(userJson) : null;
            const token = Cookies.get("token");

            if (nutriflowUser && token) {
                setUserData({
                    token: token,
                    user: nutriflowUser,
                });

                //verificar si el usuario ya completó su perfil
                if (nutriflowUser.userProfile === null && nutriflowUser.role !== "admin") {
                    router.push("/physical-form");
                }

            } else {
                console.log("No se encontró usuario o token.");
            }
        }
    }, [status]);

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("nutriflowUser");
        setUserData(null);
        signOut();
        router.push("/");
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signIn("google");
            if (result?.error) {
                
                throw new Error(result.error); // Lanzar el error para que sea manejado en el bloque catch
            }

        } catch (error) {
            if (error instanceof Error) {
                await Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: error.message || "Ocurrió un error durante la autenticación con Google.",
                });
                
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: "Ocurrió un error desconocido durante la autenticación con Google.",
                });
                
            }
        }
    };

    return (
        <AuthContext.Provider value={{ userData, setUserData, loginWithGoogle, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);