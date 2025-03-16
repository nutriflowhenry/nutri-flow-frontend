// src/validations/validationSchemas.ts
import * as Yup from 'yup';

export const physicalFormValidationSchema = Yup.object().shape({
    weight: Yup.number()
        .typeError('El peso debe ser un número')
        .required('El peso es obligatorio')
        .min(30, 'El peso debe ser mayor o igual a 30kg')
        .max(300, 'El peso debe ser menor o igual a 300kg'),

    height: Yup.number()
        .typeError('La altura debe ser un número')
        .required('La altura es obligatoria')
        .min(0.50, 'La altura debe ser mayor o igual a 0.50m')
        .max(2.50, 'La altura debe ser menor o igual a 2.50m'),

    birthdate: Yup.date()
        .typeError('La fecha de cumpleaños debe ser una fecha válida')
        .required('La fecha de cumpleaños es obligatoria')
        .test('is-valid-date', 'Fecha de cumpleaños no válida', (value) => {
            if (!value) return false;
            return !isNaN(new Date(value).getTime());
        })
        .test('is-old-enough', 'Debes tener al menos 12 años', (value) => {
            if (!value) return false;
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 12;
        })
        .test('is-not-too-old', 'No puedes tener más de 100 años', (value) => {
            if (!value) return false;
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age <= 100;
        }),

    gender: Yup.string()
        .required('El género es obligatorio'),

    activityLevel: Yup.string()
        .oneOf(['sedentary', 'moderate', 'active', 'very active'], 'Nivel de actividad no válido')
        .required('El nivel de actividad es obligatorio'),

    weightGoal: Yup.string()
        .oneOf(['lose weight', 'maintain', 'gain muscle'], 'Objetivo de peso no válido')
        .required('El objetivo de peso es obligatorio'),
});