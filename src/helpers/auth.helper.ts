import { IRegisterProps, IUserSession } from "@/types"

const APIURL = process.env.NEXT_PUBLIC_API_URL; 

export async function register(userData: IRegisterProps) {
    console.log(userData);
    try{
        const response = await fetch(`${APIURL}/auth/signup`,{
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
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
    try {
        const response = await fetch(`${APIURL}/users/google`, {
            method: "POST",
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