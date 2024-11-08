import { Outlet, useNavigate } from 'react-router-dom';
import TabBar from 'src/components/ui/TabBar';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { CommonContext } from 'src/context/CommonProvider';
import Error from 'src/components/pages/Error';
import {
    CONFIRMATION_PAGE,
    GIFTS_PAGE,
    PROFILE_PAGE,
} from 'src/constants/menu';

import s from './Layout.module.scss';

const Layout = () => {
    const { isMenuVisible, error } = useContext(CommonContext);
    const navigate = useNavigate();
    const { startParam } = useLaunchParams();

    const [initialStartParam, setInitialStartParam] = useState(startParam);

    const handleStorageEvent = useCallback(() => {
        const lsStartParam = window.localStorage.getItem('startParam');

        if (lsStartParam !== null) {
            setInitialStartParam(lsStartParam);
            window.localStorage.removeItem('startParam');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', handleStorageEvent);

        return () => window.removeEventListener('storage', handleStorageEvent);
    }, [handleStorageEvent]);

    useEffect(() => {
        if (initialStartParam) {
            if (initialStartParam.startsWith('invoicepaid_')) {
                const [, invoice] = initialStartParam.split('invoicepaid_');
                if (invoice) {
                    navigate(`/${CONFIRMATION_PAGE}`, {
                        state: { invoice, type: 'bought' },
                    });
                }
            }
            if (initialStartParam.startsWith('receive_')) {
                const [, invoice] = initialStartParam.split('receive_');
                if (invoice) {
                    navigate(`/${CONFIRMATION_PAGE}`, {
                        state: { invoice, type: 'receive' },
                    });
                }
            }
            if (initialStartParam.startsWith('gifts')) {
                navigate(GIFTS_PAGE);
            }
            if (
                initialStartParam.startsWith('view_gift') ||
                initialStartParam.startsWith('profile')
            ) {
                navigate(PROFILE_PAGE);
            }
        }
    }, [navigate, initialStartParam]);

    return (
        <>
            <div className={s.content}>
                {error ? <Error message={error} /> : <Outlet />}
            </div>
            {isMenuVisible && <TabBar />}
        </>
    );
};

export default Layout;
