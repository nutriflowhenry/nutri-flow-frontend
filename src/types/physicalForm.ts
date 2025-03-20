export interface IPhysicalForm {
    weight: number | string;
    height: number | string;
    birthdate: Date | string;
    gender: string;
    activityLevel: 'sedentary' | 'moderate' | 'active' | 'very active';
    weightGoal: 'lose weight' | 'maintain' | 'gain muscle';
}

export interface IPhysicalFormErrors {
    weight?: number | string;
    height?: number | string;
    birthdate?: Date | string;
    gender?: string;
}
