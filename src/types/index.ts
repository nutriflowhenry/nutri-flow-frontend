import { string } from "yup";

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
        email:string;
        id: number;
        name:string;
        image?:string;
        role?:string;
        userProfile?:{};
    };
    profileData?: IUserProfile;
}

export interface IUserProfile {
    id?: string;
    birthdate: Date | string;
    gender: string;
    weight: number | string;
    height: number | string;
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}



export interface AuthContextProps {
    userData: IUserSession | null;
    userProfile: IUserProfile | null;
    setUserData: (userData: IUserSession | null) => void;
    setUserProfile: (userProfile: IUserProfile | null) => void;
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
    calories: number; 
    description: string; 
    createdAt: string;
    userProfileId: string;
    isActive : boolean
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
export interface IUsers {
    id: string,
    name: string,
    email: string,
    role: string,
    subscriptionType: string,
    isActive: boolean
}