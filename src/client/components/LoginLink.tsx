import { Link } from '@tanstack/react-router';
import { KindeConfig } from '../../config';

export const LoginLink = ({ children }: { children: React.ReactNode }) => {
    return (
        <Link to={KindeConfig.loginUrl}>
            {children}
        </Link>
    )
}