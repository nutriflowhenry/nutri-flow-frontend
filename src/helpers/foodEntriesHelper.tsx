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
      throw new Error('El valor de las calorías debe ser un número mayor que 0');
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
      throw new Error(`Error al crear el food tracker: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear el food tracker:', error);
    throw error;
  }
};

export const getDailyCalories = async (date: string, token: string): Promise<ICaloriesData | undefined> => {
  try {
    const response = await fetch(`${APIURL}/food-tracker/dailyCalories?date=${date}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las calorías diarias: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      consumed: data.caloriesConsumed,
      goal: 1500,
    };
  } catch (error) {
    console.error('Error al obtener las calorías diarias:', error);
    throw error;
  }
};

export const getDailyFoodTracker = async (date: string, token: string) => {
  try {
    const response = await fetch(`${APIURL}/food-tracker/daily?date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el food tracker diario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el food tracker diario:', error);
    throw error;
  }
};

export const deleteFoodTracker = async (id: string, token: string) => {
  try {
    const response = await fetch(`${APIURL}/food-tracker/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el food tracker');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar el food tracker:', error);
    throw error;
  }
};

export const updateFoodTracker = async (
  id: string,
  foodTrackerData: ICreateFoodTracker & { isActive?: boolean },
  token: string
) => {
  try {
    const response = await fetch(`${APIURL}/food-tracker/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(foodTrackerData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el food tracker');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar el food tracker:', error);
    throw error;
  }
};