import { Url } from "url";

export interface IRegisterProps {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface IRegisterErrors {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
}

export interface IUserSession {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        profilePicture?: string;
        userProfile?: IUserProfile;
        auth0Id?: string;
        createdAt?: string;
        isActive?: boolean;
        provider?: string;
        role?: string;
        stripeCustomerId?: string;
        subscriptionType?: string;
        updatedAt?: Date;

        country?: string;
        city?: string;
        phone?: string;
        notifications?: boolean;
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
    caloriesGoal?: number | string;
    hydrationGoal?: number | string;
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
    isLoading: boolean;
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
    description?: string;
    calories: number;
    createdAt: string;
    isActive: boolean;
    image?: string; // Cambiar imageUrl a image
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

export interface IUsersStatistics {
    usersNumber: number,
    premiumUsers: number,
    freeUsers: number
}

export interface IUsersPayments {
    data: {
        id: string,
        status: string,
        created_at: Date,
        currentPeriodStart: string,
        currentPeriodEnd: string,
        canceled_at?: string;
        user: {
            id: string,
            name: string,
            subscriptionType: string,
            isActive: boolean
        }
    }[];
    pagination:{
        page: number,
        limit:number,
        totalpayments:number,
        totalPages:number
    } 
}

export interface IPostList {
    posts:{
        id: string,
        title: string,
        content:string,
        status:string,
        createdAt: string,
        image?:string,
        reactions:[],
        author:{
            id:string,
            name:string,
            profilePicture:string,
        }
    }[];
    pagination:{
        page: 1,
        limit: 10,
        totalpayments:number,
        totalPages:number
    } 
}