import { Link } from '@tanstack/react-router';
import { KindeConfig } from '../../config';

export const LogoutLink = ({ children }: { children: React.ReactNode }) => {
  return <Link to={KindeConfig.logoutUrl}>{children}</Link>;
};
