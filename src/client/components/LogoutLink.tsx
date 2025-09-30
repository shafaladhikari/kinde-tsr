import { Link } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { getClientSession } from '../store';

export const LogoutLink = ({ children }: { children: React.ReactNode }) => {
    const terminateLocalSession = async () => {
        await getClientSession().destroySession();
    }
    return (
        <Link to={KindeConfig.logoutUrl} onClick={terminateLocalSession}>
            {children}
        </Link>
    )
}