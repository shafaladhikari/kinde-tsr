import { LogoutLink as ReactLogoutLink } from '@kinde-oss/kinde-auth-react/components';
import { KindeConfig } from '../../config';

export const LogoutLink = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReactLogoutLink redirectUrl={KindeConfig.logoutUrl}>
            {children}
        </ReactLogoutLink>
    )
}