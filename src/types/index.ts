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
    }
}
export interface AuthContextProps {
    userData: IUserSession | null;
    setUserData: (userData: IUserSession | null) => void;
    loginWithGoogle: () => void;
    loginWithEmail: (user: IUserSession) => void;
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
  }
  

export interface ICreateFoodTracker {
    name: string; 
    calories: number; 
    description?: string;
}