import { IRegisterErrors, IRegisterProps } from "@/types";

export function validateRegisterForm(values: IRegisterProps){
    const errors: IRegisterErrors = {};

    if (!values.name){
        errors.name = "The username field is required";
    } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
        errors.name = 'Name must only contain letters and spaces';
    }
    
    if (!values.email) {
        errors.email = "The email field is required";
    } else if(values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Invalid email"
    }

    if (!values.password) {
        errors.password = "The Password field is required";
    } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
    }

    if (!values.passwordConfirmation) {
        errors.passwordConfirmation = "The passwordConfirmation field is required";
    } else if (values.passwordConfirmation != values.password) {
        errors.passwordConfirmation = 'The passwords dont match';
    }    
    
    return errors;
}