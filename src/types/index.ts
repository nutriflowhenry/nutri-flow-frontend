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

export interface IAlertState {
    type: 'success' | 'error';
    message: string; 
}