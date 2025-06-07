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
  faRunning,
  faKey,
  faUserSlash, faBell
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { uploadImage } from '@/helpers/uploadImage';
import { getCurrentUser } from "@/helpers/auth.helper";
import * as Yup from 'yup';
import { userInfoValidationSchema, physicalFormValidationSchema } from '@/helpers/validationSchemas';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

const defaultProfilePicture = 'https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png';

const SettingsView = () => {
  const { userData, setUserData, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
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
  const [passwordFormData, setPasswordFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [userInfoValidationErrors, setUserInfoValidationErrors] = useState<{ [key: string]: string }>({})
  const [passwordValidationErrors, setPasswordValidationErrors] = useState<{ [key: string]: string }>({});

  // Animaciones
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer! Tu cuenta será desactivada y no podrás volver a acceder.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b8f71',
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        if (!userData || !userData.token) {
          console.error("userData o token es null");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        });

        if (response.ok) {
          Swal.fire({
            title: 'Cuenta Eliminada',
            text: 'Tu cuenta ha sido eliminada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            // Redirigir al usuario a la página de inicio o de inicio de sesión
            logout();
            window.location.href = '/';
          });
        } else {
          throw new Error('Error al eliminar la cuenta');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al intentar eliminar la cuenta.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value,
    });
    // Limpiar errores de validación
    if (passwordValidationErrors[name]) {
      setPasswordValidationErrors({
        ...passwordValidationErrors,
        [name]: '',
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar los campos
    if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
      setPasswordValidationErrors({
        confirmNewPassword: 'Las contraseñas no coinciden',
      });
      return;
    }

    try {
      if (!userData || !userData.token) {
        console.error("userData o token es null");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordFormData.newPassword,
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Contraseña actualizada con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        setIsEditingPassword(false);
        setPasswordFormData({
          newPassword: '',
          confirmNewPassword: '',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la contraseña');
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      let errorMessage = 'Error al actualizar la contraseña';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

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
      await uploadImage(userData.user.id.toString(), file, userData.token);
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
        const updatedUser = await getCurrentUser(userData.token);
        console.log("del response ", updatedUser);
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
    <div className="min-h-screen font-sora py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1
          className="text-4xl font-bold text-[#5a5f52] mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Configuración de Cuenta
        </motion.h1>

      {userData ? (
        <motion.div
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Información del Usuario */}
          <motion.div
            variants={fadeInUp}
            className="bg-[#e7e3d8] p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-[#5a5f52] mb-6">Detalles de la Cuenta</h2>
            {isEditingUserInfo ? (
              <form onSubmit={handleUserInfoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={userInfoFormData.name}
                    onChange={handleUserInfoChange}
                    className="mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
                  />
                  {userInfoValidationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{userInfoValidationErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email
                    {userData?.user?.provider === "auth0" && (<strong> (Sesión de Google) </strong>)}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userInfoFormData.email}
                    onChange={handleUserInfoChange}
                    disabled={userData?.user?.provider === "auth0"}
                    className={`mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3 ${userData?.user?.provider === "auth0" ? "opacity-50 cursor-not-allowed" : ""
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
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-xl transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-xl transition duration-300"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-gray-700">
                {(() => {
                  console.log("Info:", userData.user.profilePicture);
                  return null; // Retorna null para no renderizar nada adicional
                })()}

                <img
                  src={userData.user.profilePicture || defaultProfilePicture}
                  alt="Perfil"
                  className="w-32 h-32 rounded-full mb-4 mx-auto  object-cover border-4 border-[#a7b8a8] shadow-md"
                />
                <div className="flex relative justify-center items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="profile-picture-upload"
                  />
                  <motion.label
                    htmlFor="profile-picture-upload"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="block bg-[#6b8f71] hover:bg-[#5a7c62] text-white font-medium py-2 px-6 rounded-xl cursor-pointer transition duration-300"
                  >
                    Cambiar Foto de Perfil
                  </motion.label>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center text-lg">
                    <FontAwesomeIcon icon={faSpellCheck} className="mr-3 text-[#6b8f71]" />
                    <strong className="w-24">Nombre:</strong> <span className="ml-2">{userData.user.name}</span>
                  </p>
                  <p className="flex items-center text-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-[#6b8f71]" />
                    <strong className="w-24">Email:</strong> <span className="ml-2 truncate max-w-[180px] md:max-w-none">{userData.user.email}</span>
                  </p>
                </div>
                <motion.button
                  onClick={() => setIsEditingUserInfo(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#6b8f71] hover:bg-[#5a7c62] text-white font-medium py-3 px-6 rounded-xl transition duration-300 mt-4"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Editar Información
                </motion.button>
              </div>
            )}

        </motion.div>
            {/* Detalles del Perfil */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#e7e3d8] p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-[#5a5f52] mb-6">Detalles del Perfil</h2>
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
                      className="mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
                    />
                    {validationErrors.birthdate && <p className="text-red-500 text-sm mt-1">{validationErrors.birthdate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                    <select
                      name="gender"
                      value={profileFormData.gender}
                      onChange={handleProfileInputChange}
                      className="mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
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
                      className="mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
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
                      className="mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
                    />
                    {validationErrors.height && <p className="text-red-500 text-sm mt-1">{validationErrors.height}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Actividad Física</label>
                    <select
                      name="activityLevel"
                      value={profileFormData.activityLevel}
                      onChange={handleProfileInputChange}
                      className="mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
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
                      className="mt-1 block w-full rounded-lg border-[#a7b8a8] shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
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
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-xl transition duration-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-xl transition duration-300"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="flex items-center text-lg">
                      <FontAwesomeIcon icon={faCakeCandles} className="mr-3 text-[#6b8f71]" />
                      <strong className="w-32">Cumpleaños:</strong> <span className="ml-2">
                        {userData.user.userProfile?.birthdate
                          ? new Date(userData.user.userProfile.birthdate).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          : "--"}
                      </span>
                    </p>
                    <p className="flex items-center text-lg">
                      <FontAwesomeIcon icon={faVenusMars} className="mr-3 text-[#6b8f71]" />
                      <strong className="w-32">Género:</strong> <span className="ml-2">
                        {userData.user.userProfile?.gender ? genderMap[userData.user.userProfile?.gender as keyof typeof genderMap] : "--"}
                      </span>
                    </p>

                    <p className="flex items-center text-lg">
                      <FontAwesomeIcon icon={faWeightScale} className="mr-3 text-[#6b8f71]" />
                      <strong className="w-32">Peso:</strong> <span className="ml-2">{userData.user.userProfile?.weight || "--"} kg</span>
                    </p>
                    <p className="flex items-center text-lg">
                      <FontAwesomeIcon icon={faChildReaching} className="mr-3 text-[#6b8f71]" />
                      <strong className="w-32">Altura:</strong> <span className="ml-2">{userData.user.userProfile?.height || "--"} cm</span>
                    </p>
                    <p className="flex items-center text-lg">
                      <FontAwesomeIcon icon={faRunning} className="mr-3 text-[#6b8f71]" />
                      <strong className="w-32">Nivel de Actividad:</strong> <span className="ml-2">
                        {userData.user.userProfile?.activityLevel ? activityLevelMap[userData.user.userProfile.activityLevel as keyof typeof activityLevelMap] : "--"}
                      </span>
                    </p>
                    <p className="flex items-center text-lg">
                      <FontAwesomeIcon icon={faBullseye} className="mr-3 text-[#6b8f71]" />
                      <strong className="w-32">Objetivo de Peso:</strong> <span className="ml-2">
                        {userData.user.userProfile?.weightGoal ? weightGoalMap[userData.user.userProfile.weightGoal as keyof typeof weightGoalMap] : "--"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full bg-[#6b8f71] hover:bg-[#5a7c62] text-white font-medium py-3 px-6 rounded-xl transition duration-300"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Editar Perfil
                  </button>

                </div>
              )}
            </motion.div>
            {/* Ajustes Avanzados */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#e7e3d8] p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-[#5a5f52] mb-6">Ajustes Avanzados</h2>
              {isEditingPassword ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
                    />
                    {passwordValidationErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordValidationErrors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={passwordFormData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#6b8f71] focus:ring-[#6b8f71] text-black bg-white p-3"
                    />
                    {passwordValidationErrors.confirmNewPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordValidationErrors.confirmNewPassword}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingPassword(false)}
                      className="bg-[#7f9c91] hover:bg-[#6d8a80] text-white font-medium py-2 px-6 rounded-xl transition duration-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#6b8f71] hover:bg-[#5a7c62] text-white font-medium py-2 px-6 rounded-xl transition duration-300"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <motion.button
                    onClick={() => router.push("/notifications")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#6b8f71] hover:bg-[#5a7c62] text-white font-medium py-3 px-6 rounded-xl transition duration-300 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faBell} className="mr-2" />
                    Notificaciones
                  </motion.button>
                  {userData?.user?.provider !== "auth0" && (
                    <motion.button
                      onClick={() => setIsEditingPassword(true)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#7f9c91] hover:bg-[#6d8a80] text-white font-medium py-3 px-6 rounded-xl transition duration-300 flex items-center justify-center mt-4"
                    >
                      <FontAwesomeIcon icon={faKey} className="mr-2" />
                      Cambiar Contraseña
                    </motion.button>
                  )}
                  <motion.button
                    onClick={handleDeleteAccount}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#6b8f71] hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition duration-300 flex items-center justify-center mt-4"
                  >
                    <FontAwesomeIcon icon={faUserSlash} className="mr-2" />
                    Eliminar Cuenta
                  </motion.button>
                </div>
              )}

          </motion.div>
      </motion.div>

      ) : (
        <div className="text-gray-700 text-center">
          <p>No se encontraron datos del usuario.</p>
        </div>
      )}
      </motion.div>
    </div>
  );
};

export default SettingsView;