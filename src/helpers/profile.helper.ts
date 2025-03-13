const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function createProfile(token: string, translatedValues: {}) {
    try {
        const response = await fetch(`${APIURL}/user-profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,// 
            },
            body: JSON.stringify(translatedValues),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        console.log("respuesta back en form fisico", response.json())

    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
    }
}