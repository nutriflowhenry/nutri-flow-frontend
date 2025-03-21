'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVenusMars,
  faEnvelope,
  faChildReaching,
  faWeightScale,
  faCakeCandles,
  faSpellCheck,
  faEdit,
  faBullseye,
  faRunning
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { uploadImage } from '@/helpers/uploadImage';
import { getCurrentUser } from "@/helpers/auth.helper";
import * as Yup from 'yup';
import { userInfoValidationSchema, physicalFormValidationSchema } from '@/helpers/validationSchemas';

interface FormData {
  birthdate: Date | string;
  gender: string;
  weight: string;
  height: string;
  activityLevel?: 'sedentary' | 'moderate' | 'active' | 'very active';
  weightGoal?: 'lose weight' | 'maintain' | 'gain muscle';
}

const genderMap = {
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro',
};

const activityLevelMap = {
  sedentary: 'Sedentario',
  moderate: 'Moderado',
  active: 'Activo',
  'very active': 'Muy Activo',
};

const weightGoalMap = {
  'lose weight': 'Perder Peso',
  maintain: 'Mantener Peso',
  'gain muscle': 'Ganar Músculo',
};

const SettingsView = () => {
  const { userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [profileFormData, setProfileFormData] = useState<FormData>({
    birthdate: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    weightGoal: 'maintain',
  });
  const [userInfoFormData, setUserInfoFormData] = useState({
    name: userData?.user.name || '',
    email: userData?.user.email || ''
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [userInfoValidationErrors, setUserInfoValidationErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (userData) {
      console.log("En el Dashboard", userData);
      setLoading(false);
      setUserInfoFormData({
        name: userData.user.name,
        email: userData.user.email
      });
      setProfileFormData({
        birthdate: userData.user.userProfile?.birthdate || '',
        gender: userData.user.userProfile?.gender || '',
        weight: userData.user.userProfile?.weight?.toString() || '',
        height: userData.user.userProfile?.height?.toString() || '',
        activityLevel: userData.user.userProfile?.activityLevel || 'sedentary',
        weightGoal: userData.user.userProfile?.weightGoal || 'maintain',
      });
    } else {
      setLoading(false);
    }
  }, [userData]);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileFormData({
      ...profileFormData,
      [name]: value
    });
    // Limpiar el error de validación cuando el usuario modifica el campo
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfoFormData({
      ...userInfoFormData,
      [name]: value
    });
    // Limpiar el error de validación cuando el usuario modifica el campo
    if (userInfoValidationErrors[name]) {
      setUserInfoValidationErrors({
        ...userInfoValidationErrors,
        [name]: ''
      });
    }

  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file || !userData) return;

    try {
      await uploadImage(userData.user.id.toString(), file);
      const user = await getCurrentUser(userData.token);
      setUserData({
        token: userData.token,
        user: user
      });
      Swal.fire({
        title: '¡Éxito!',
        text: 'Imagen de perfil actualizada con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al subir la imagen de perfil',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validar los datos del formulario
      await physicalFormValidationSchema.validate(profileFormData, { abortEarly: false });
      setValidationErrors({}); // Limpiar errores si la validación es exitosa

      if (!userData || !userData.token) {
        console.error("userData o token es null");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-profiles`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthdate: profileFormData.birthdate,
          gender: profileFormData.gender,
          weight: parseFloat(profileFormData.weight),
          height: parseFloat(profileFormData.height),
          activityLevel: profileFormData.activityLevel,
          weightGoal: profileFormData.weightGoal,
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedProfile = responseData.updatedUserProfile;

        setUserData({
          ...userData,
          user: {
            ...userData.user,
            userProfile: {
              ...userData.user.userProfile,
              ...updatedProfile
            }
          }
        });
        setIsEditingProfile(false);

        Swal.fire({
          title: '¡Éxito!',
          text: 'Perfil actualizado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } else {
        throw new Error('Error al actualizar el perfil');
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Mostrar errores de validación
        const errors = error.inner.reduce((acc, curr) => {
          if (curr.path) {
            acc[curr.path] = curr.message;
          }
          return acc;
        }, {} as { [key: string]: string });

        setValidationErrors(errors);
        Swal.fire({
          title: 'Error de validación',
          text: 'Por favor, corrige los errores en el formulario',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al actualizar el perfil',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  const handleUserInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validar los datos del formulario
      await userInfoValidationSchema.validate(userInfoFormData, { abortEarly: false });
      setUserInfoValidationErrors({});

      if (!userData) {
        console.error("userData es null");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userData?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfoFormData.name,
          email: userInfoFormData.email
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData({
          ...userData,
          user: {
            ...userData.user,
            ...updatedUser
          }
        });
        setIsEditingUserInfo(false);

        Swal.fire({
          title: '¡Éxito!',
          text: 'Información del usuario actualizada con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } else {
        throw new Error('Error al actualizar la información del usuario');
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Mostrar errores de validación
        const errors = error.inner.reduce((acc, curr) => {
          if (curr.path) {
            acc[curr.path] = curr.message;
          }
          return acc;
        }, {} as { [key: string]: string });

        setUserInfoValidationErrors(errors);
        Swal.fire({
          title: 'Error de validación',
          text: 'Por favor, corrige los errores en el formulario',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al actualizar la información del usuario',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  if (loading) {
    return <p className="text-gray-700 text-center py-8">Cargando...</p>;
  }

  return (
    <div className="p-8 bg-white shadow-lg rounded-xl max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Ajustes de Usuario</h1>
      {userData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FORMULARIO de Información del Usuario */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Detalles de la Cuenta</h2>
            {isEditingUserInfo ? (
              <form onSubmit={handleUserInfoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={userInfoFormData.name}
                    onChange={handleUserInfoChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  />
                  {userInfoValidationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{userInfoValidationErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userInfoFormData.email}
                    onChange={handleUserInfoChange}
                    disabled={userData?.user?.provider === "auth0"} 
                    className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white ${
                      userData?.user?.provider === "auth0" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  />
                  {userInfoValidationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{userInfoValidationErrors.email}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingUserInfo(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-gray-700">
                <img
                  src={userData.user.profilePicture}
                  alt="Perfil"
                  className="w-32 h-32 rounded-full mb-6 mx-auto"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                />
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faSpellCheck} className="mr-3 text-orange-600" />
                  <strong>Nombre:</strong> <span className="ml-2">{userData.user.name}</span>
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-orange-600" />
                  <strong>Email:</strong> <span className="ml-2">{userData.user.email}</span>
                </p>
                <button
                  onClick={() => setIsEditingUserInfo(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Editar Información
                </button>
              </div>
            )}
          </div>

          {/* FORMULARIO de Detalles del Perfil */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Detalles del Perfil</h2>
            {isEditingProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={
                      profileFormData.birthdate instanceof Date
                        ? profileFormData.birthdate.toISOString().split('T')[0]
                        : profileFormData.birthdate || ''
                    }
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  />
                  {validationErrors.birthdate && <p className="text-red-500 text-sm mt-1">{validationErrors.birthdate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                  <select
                    name="gender"
                    value={profileFormData.gender}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                  {validationErrors.gender && <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={profileFormData.weight}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  />
                  {validationErrors.weight && <p className="text-red-500 text-sm mt-1">{validationErrors.weight}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={profileFormData.height}
                    onChange={handleProfileInputChange}
                    step="0.01"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  />
                  {validationErrors.height && <p className="text-red-500 text-sm mt-1">{validationErrors.height}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Actividad Física</label>
                  <select
                    name="activityLevel"
                    value={profileFormData.activityLevel}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  >
                    <option value="sedentary">Sedentario</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Activo</option>
                    <option value="very active">Muy Activo</option>
                  </select>
                  {validationErrors.activityLevel && <p className="text-red-500 text-sm mt-1">{validationErrors.activityLevel}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo de Peso</label>
                  <select
                    name="weightGoal"
                    value={profileFormData.weightGoal}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  >
                    <option value="lose weight">Perder Peso</option>
                    <option value="maintain">Mantener Peso</option>
                    <option value="gain muscle">Ganar Músculo</option>
                  </select>
                  {validationErrors.weightGoal && <p className="text-red-500 text-sm mt-1">{validationErrors.weightGoal}</p>}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-gray-700">
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faCakeCandles} className="mr-3 text-green-600" />
                  <strong>Cumpleaños:</strong> <span className="ml-2">
                    {userData.user.userProfile?.birthdate
                      ? new Date(userData.user.userProfile.birthdate).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      : "--"}
                  </span>
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faVenusMars} className="mr-3 text-green-600" />
                  <strong>Género:</strong> <span className="ml-2">
                    {userData.user.userProfile?.gender ? genderMap[userData.user.userProfile?.gender as keyof typeof genderMap] : "--"}
                  </span>
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faWeightScale} className="mr-3 text-green-600" />
                  <strong>Peso:</strong> <span className="ml-2">{userData.user.userProfile?.weight || "--"} kg</span>
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faChildReaching} className="mr-3 text-green-600" />
                  <strong>Altura:</strong> <span className="ml-2">{userData.user.userProfile?.height || "--"} cm</span>
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faRunning} className="mr-3 text-blue-600" />
                  <strong>Nivel de Actividad:</strong> <span className="ml-2">
                    {userData.user.userProfile?.activityLevel ? activityLevelMap[userData.user.userProfile.activityLevel as keyof typeof activityLevelMap] : "--"}
                  </span>
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faBullseye} className="mr-3 text-blue-600" />
                  <strong>Objetivo de Peso:</strong> <span className="ml-2">
                    {userData.user.userProfile?.weightGoal ? weightGoalMap[userData.user.userProfile.weightGoal as keyof typeof weightGoalMap] : "--"}
                  </span>
                </p>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Editar Perfil
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-700 text-center">
          <p>No se encontraron datos del usuario.</p>
        </div>
      )}
    </div>
  );
};

export default SettingsView;