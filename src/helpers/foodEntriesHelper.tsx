import { ICaloriesData, ICreateFoodTracker } from '@/types';

const APIURL = process.env.NEXT_PUBLIC_API_URL;



export const createFoodTracker = async (
  foodData: ICreateFoodTracker,
  token: string
) => {
  try {
    

    let caloriesValue: number;

    if (typeof foodData.calories === 'number') {
      caloriesValue = foodData.calories;
    } else if (typeof foodData.calories === 'string') {
      caloriesValue = parseFloat(foodData.calories);
    } else {
      throw new Error('El valor de las calorías es inválido.');
    }

    if (isNaN(caloriesValue) || caloriesValue <= 0) {
      throw new Error(
        'El valor de las calorías debe ser un número mayor que 0'
      );
    }

    
    
    const foodDataWithValidCalories = {
      ...foodData,
      calories: caloriesValue,
    };

    const response = await fetch(`${APIURL}/food-tracker/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(foodDataWithValidCalories),
    });
    

    if (!response.ok) {
      
      const error = await response.json();
      throw new Error(
        `Error al crear el food tracker: ${
          error.message || response.statusText
        }`
      );
    } else {
      
      alert("Comida creada con exito")
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear el food tracker:', error);
    throw error;
  }
};

interface DailyCaloriesResponse {
  consumed: number;
  goal: number;
}

export async function getDailyCalories(date: string, token: string): Promise<ICaloriesData| undefined> {
  try {
    const response = await fetch(
      `${APIURL}/food-tracker/dailyCalories?date=${date}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener las calorías diarias: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      consumed: data.caloriesConsumed, 
      goal: 1500 
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message); 
    } else {
      console.error('Error desconocido:', error);
    }
    throw error; 
  }
}

export async function getDailyFoodTracker(date: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/food-tracker/daily?date=${date}`, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log(date)
      return await response.json();
    } else {
      throw new Error('Error al obtener el food tracker diario');
    }
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : 'Error desconocido');
  }
}


export async function deleteFoodTracker(id: string, token: string) {
  
  try {
    const response = await fetch(`${APIURL}/food-tracker/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
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
  foodTrackerData: ICreateFoodTracker,
  token: string
) {
  try {
    const response = await fetch(`${APIURL}/food-tracker/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
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