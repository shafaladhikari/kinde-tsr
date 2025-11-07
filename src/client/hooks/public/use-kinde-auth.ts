import { useKindeAuth as useKindeAuthReact } from '@kinde-oss/kinde-auth-react';

export const useKindeAuth = () => {
  const { login, logout, register, ...rest } = useKindeAuthReact();
  return {
    login,
    logout,
    ...rest,
  };
};
