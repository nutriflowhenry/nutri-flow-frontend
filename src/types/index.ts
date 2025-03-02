export interface IRegisterProps {
    name: string;
    email: string;
    password: string;
    confirmPassword:string;
}

export interface IRegisterErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?:string;
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

