import { IRegisterErrors, IRegisterProps } from "@/types";

export function validateRegisterForm(values: IRegisterProps){
    const errors: IRegisterErrors = {};

    if (!values.name){
        errors.name = "El nombre de usuario es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
        errors.name = 'El nombre solo debe contener letras y espacios.';
    }
    
    if (!values.email) {
        errors.email = "El email es obligatorio.";
    } else if(values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Email inválido"
    }

    if (!values.password) {
        errors.password = "La contraseña es obligatoria";
    } else if (values.password.length < 8) {
        errors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/.test(values.password)) {
        errors.password = "La contraseña debe contener al menos una mayúscula, un número y un carácter especial.";
    }

    if (!values.passwordConfirmation) {
        errors.passwordConfirmation = "Confirmar la contraseña es obligatorio";
    } else if (values.passwordConfirmation != values.password) {
        errors.passwordConfirmation = 'Las contraseñas no coinciden';
    }    
    
    return errors;
}