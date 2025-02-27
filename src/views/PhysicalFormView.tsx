'use client'
import React from 'react'
import { useFormik } from 'formik'
import { IPhysicalForm } from '@/types/physicalForm'

const PhysicalFormView = () => {
    
const formik = useFormik<IPhysicalForm>({
    initialValues: {
        peso: 60,
        altura:1.65 ,
        edad: 20 ,
        genero: '',
    },
    onSubmit: (values) => {
        console.log("Datos enviados:", values);
    },
    
    validate: (values) => {
        const errors: Partial<IPhysicalForm> = {}; 
        if (!values.peso){
            errors.peso = "El peso es obligatorio"
        }else if (values.peso<20 || values.peso>300){
            errors.peso="El peso debe estar entre 20kg y 300kg"
        };

        if (!values.altura){
            errors.altura = "La altura es obligatoria"
        }else if (values.altura < 0.50 || values.altura > 2.50) {
            errors.altura = "La altura debe estar entre 0.50 m y 2.50 m";
        };

        if (!values.edad){ 
            errors.edad = "La edad es obligatoria"
        }else if(values.edad<12 || values.edad>100){
            errors.edad="La edad debe ser entre los 12 años y 100 años"
        };
        if (!values.genero) errors.genero = "El género es obligatorio";
        return errors;
    },

    });
return (
    <div>
        <h2>registro fisico</h2>
        <form onSubmit={formik.handleSubmit}>
            <div>
            <label>Peso(kg)</label>
            <input 
            type="number"
            name='peso'
            value={formik.values.peso}
            onChange={formik.handleChange}

            />
        {formik.errors.peso&& <p>{formik.errors.peso}</p> }
            </div>

            <div>
                <label >Altura(mts)</label>
                <input 
                type="number"
                name='altura'
                value={formik.values.altura}
                onChange={formik.handleChange} 
                />
                {formik.errors.altura && <p>{formik.errors.altura}</p> }
            </div>

            <div>
                <label >Edad</label>
                <input
                type="number"
                name='edad'
                value={formik.values.edad}
                onChange={formik.handleChange}
                />
                {formik.errors.edad && <p>{formik.errors.edad}</p> }  
            </div>

            <div>
                <label >Genero</label>
                <select
            name="genero"
            value={formik.values.genero}
            onChange={formik.handleChange}
        >
            <option value="">Seleccionar</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
        </select>
        {formik.errors.genero && <p>{formik.errors.genero}</p>}

            </div>
            <div>
            <button type="submit">Enviar</button>
            </div>
        </form>
    </div>
)
    
}

export default PhysicalFormView