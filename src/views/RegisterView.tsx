'use client'
import React, { useState } from 'react'
import { Formik, Field, Form} from 'formik';
import { validateRegisterForm } from '@/helpers/validate';
import { register } from '@/helpers/auth.helper';
import { useRouter } from 'next/navigation';
import { IAlertState } from '@/types';
import Alert from '@/components/Alert';
import { useAuth } from '@/context/AuthContext';

const RegisterView = () =>{
    const router = useRouter();
    const [alert, setAlert] = useState<IAlertState | null>(null); 
    const { loginWithGoogle } = useAuth();

    return (

        <div>
        <h1>Sign Up</h1>    

        <Formik
            initialValues= {{
            name: '',
            email: '',
            password: '',
            passwordConfirmation:'',
            }}

            onSubmit = {async (values) => {
            try {
                await register(values);
                setAlert({ type: 'success', message: 'User registered succesfully'}); 
                setTimeout(() => {
                router.push('/login');
                }, 2000);
                
            } catch (error) {
                setAlert({ type: 'error', message: 'There was an error registering the user'});
            }
            }}

            validate = {validateRegisterForm}
        >
            {({ errors, touched, isValid }) => (
            
            <Form className="space-y-4 md:space-y-6" action="#">

            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <Field type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-700 focus:border-amring-amber-700 block w-full p-2.5" placeholder="Jhon" required=""/>
                {errors.name && touched.name && (
                    <Alert type="error" message={errors.name}/>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <Field type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-700 focus:border-amring-amber-700 block w-full p-2.5" placeholder="Jhon@gmail.com" required=""/>
                {errors.email && touched.email && (
                    <Alert type="error" message={errors.email} />
                )}
            </div>   

            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <Field type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-700 focus:border-amring-amber-700 block w-full p-2.5" placeholder="********" required=""/>
                {errors.password && touched.password && (
                    <Alert type="error" message={errors.password} />
                )}
            </div>

            <div>
                <label htmlFor="passwordConfirmation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <Field type="password" name="passwordConfirmation" id="passwordConfirmation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-700 focus:border-amring-amber-700 block w-full p-2.5" placeholder="********" required=""/>
                {errors.passwordConfirmation && touched.passwordConfirmation && (
                    <Alert type="error" message={errors.passwordConfirmation}/>
                )}
            </div>

            <button disabled = { !isValid } type="submit" className="w-full text-white bg-amber-700 hover:bg-amber-900 focus:ring-4 focus:outline-none focus:ring-amber-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
            <div>or</div>
            <button type="button" className="w-full text-white bg-blue-600 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5" onClick={loginWithGoogle}>
                Sign Up with Google
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account? <a href="/login" className="font-medium text-amring-amber-700 hover:underline">Login here</a>
            </p>
            
            </Form>
            )}
            
        </Formik>
    </div>    
    )
}

export default RegisterView;