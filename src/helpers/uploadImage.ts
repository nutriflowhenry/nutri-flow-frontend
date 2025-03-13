const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const uploadImage = async (userId: string, file: File): Promise<string> => {
    try {
        // 1. Obtener la URL pre-firmada del backend
        const response = await fetch(`${APIURL}/upload/profile/upload-url/${userId}?type=${file.type.split('/')[1]}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Estado de la respuesta:', response.status, response.statusText);
        console.log('response:', response);

        if (!response.ok) {
            console.log('Entrooo a ok false');
            const errorData = await response.json();
            throw new Error(`Error al obtener la URL pre-firmada: ${errorData.message || response.statusText}`);
        }

        // Extrae la URL pre-firmada
        // const uploadUrl = await response.text();
        const { uploadUrl } = await response.json();
        console.log('URL pre-firmada:', uploadUrl);

        // 2. Subir la imagen directamente a S3

        if (!uploadUrl) {
            throw new Error('No se pudo obtener la URL pre-firmada del backend');
        }

        try {
            console.log('File:', file);
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

        } catch (error: any) {
            console.log('ERRRORRR!:', error);
            throw error;

        }


        // 3. Notificar al backend para actualizar la ruta de la imagen en la base de datos
        const updateResponse = await fetch(`${APIURL}/users/${userId}/profile-picture`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileType: file.type.split('/')[1] }),
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Error al actualizar la ruta de la imagen en el backend: ${errorData.message || updateResponse.statusText}`);
        }

        // Retorna la URL de la imagen subida
        return uploadUrl.split('?')[0]; // Elimina los parámetros de la URL
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }
};