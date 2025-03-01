import { IRegisterProps, IUserSession } from "@/types"

const APIURL = process.env.NEXT_PUBLIC_API_URL; 

export async function register(userData: IRegisterProps) {
    try{
        const response = await fetch(`${APIURL}/users/register`,{
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

// export async function registerWithGoogle (googleToken: string) : Promise<IUserSession | null> {
//     try {
//         const userSession = await fetch(`${APIURL}/auth/google-login`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ token: googleToken }),
//         });

//         if (!userSession.ok) throw new Error("Error en la autenticación");

//         return await userSession.json();

//     } catch (error) {
//         console.error("Error al autenticar con el backend:", error);
//         return null;
//     }
// };

