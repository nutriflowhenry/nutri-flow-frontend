import { ICreateFoodTracker } from '@/types';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function createFoodTracker(
  foodTrackerData: ICreateFoodTracker,
  token: string
) {
  try {
    const response = await fetch(`${APIURL}/food-tracker/create`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(foodTrackerData),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al crear el food tracker');
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getDailyCalories(date: string, token: string) {
  try {
    const response = await fetch(
      `${APIURL}/food-tracker/dailyCalories?date=${date}`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al obtener las calorías diarias');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.log(error.message); // Manejo seguro de errores estándar
      } else {
        console.log("Error desconocido:", error);
      }
  }
}

export async function getDailyFoodTracker(date: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/food-tracker/daily?date=${date}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al obtener el food tracker diario');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.log(error.message); // Manejo seguro de errores estándar
      } else {
        console.log("Error desconocido:", error);
      }
  }
}

export async function deleteFoodTracker(id: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/food-tracker/delete${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al eliminar el food tracker');
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateFoodTracker(
  id: string,
  foodTrackerData: UpdateFoodTrackerDto,
  token: string
) {
  try {
    const response = await fetch(`${APIURL}/food-tracker/update${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(foodTrackerData),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al actualizar el food tracker');
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
