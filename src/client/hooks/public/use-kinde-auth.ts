import { useKindeAuth as useKindeAuthReact, type KindeContextProps} from '@kinde-oss/kinde-auth-react';

export const useKindeAuth = (): Omit<KindeContextProps, 'register'> => {
  const { login, logout, register, ...rest } = useKindeAuthReact();
  return {
    login,
    logout,
    ...rest,
  };
};
