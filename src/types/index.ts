export interface IRegisterProps {
    name: string;
    email: string;
    password: string;
    passwordConfirmation:string;
}

export interface IRegisterErrors {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?:string;
}

export interface IUserSession {
    token: string;
    user: {
        id: string;
        email:string;
        name:string;
        profilePicture?:string;
        userProfile?: IUserProfile;
        auth0Id?: string;
        createdAt?: string;
        isActive?: boolean;
        provider?: string;
        role?:string;
        stripeCustomerId?: string;
        subscriptionType?: string;
        updatedAt?: Date;
    };
}

export interface IUserProfile {
    id?: string;
    birthdate: Date | string;
    gender: string;
    weight: number | string;
    height: number | string;
    activityLevel?: 'sedentary' | 'moderate' | 'active' | 'very active';
    weightGoal?: 'lose weight' | 'maintain' | 'gain muscle';
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}



export interface AuthContextProps {
    userData: IUserSession | null;
    setUserData: (userData: IUserSession | null) => void;
    loginWithGoogle: () => void;
    logout: () => void;
}

export interface IAlertState {
    type: 'success' | 'error';
    message: string; 
}


export interface IloginProps {
    email: string;
    password: string;
}


export interface IFoodTracker {
    id: string;
    name: string;
    description?: string; // Opcional
    calories: number;
    createdAt: string;
    isActive: boolean;
    imageUrl?: string; // Nueva propiedad opcional para la URL de la imagen
  }
  

export interface ICreateFoodTracker {
    name: string; 
    calories: number; 
    description?: string;
}

export interface ICaloriesData {
    consumed: number;
    goal: number;
  }
  
