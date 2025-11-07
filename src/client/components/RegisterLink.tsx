import { Link } from '@tanstack/react-router';
import { KindeConfig } from '../../config';

export const RegisterLink = ({ children }: { children: React.ReactNode }) => {
    return (
        <Link to={KindeConfig.registerUrl}>
            {children}
        </Link>
    )
}