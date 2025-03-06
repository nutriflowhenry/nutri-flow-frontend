import { IRegisterProps, IUserSession, IloginProps } from "@/types"
import Swal from "sweetalert2";
import Cookies from 'js-cookie';

const APIURL = process.env.NEXT_PUBLIC_API_URL; 

export async function register(userData: IRegisterProps) {
    console.log("register manual",userData);
    try{
        const response = await fetch(`${APIURL}/auth/signup`,{
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(userData)
        }) 

        if(response.ok){
            return response.json()
        } else {
            alert("The new user register have failed")
        }
        
    } catch (error:any){
        alert("The new user register have failed")
        throw new Error(error)
    }
};

export async function registerWithGoogle(googleToken: string) {
    console.log("funcion registro con google")
    try {
        const response = await fetch(`${APIURL}/auth/google`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: googleToken }),
        });

        if (response.ok) {

            return response.json();

        } else {
            throw new Error("Google authentication failed");
        }
    } catch (error: any) {
        console.error("Google registration error:", error);
        throw new Error(error);
    }
}

export async function login(userData: IloginProps) {
    try {
        const response = await fetch(`${APIURL}/auth/login`, {
            method:'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        if(response.ok) {
            return response.json()
        } else {
            await Swal.fire({
                icon: "error",
                title: "Error de inicio de sesión",
                text: "Falló el login del usuario.",
            });
        }
    }catch (error: unknown) {
        await Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "catch:Falló el login del usuario.",
        });
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred");
    }
};