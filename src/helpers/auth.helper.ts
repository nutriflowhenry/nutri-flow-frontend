import { IRegisterProps } from "@/types"

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

