import { memo, useContext, useEffect } from 'react';
import Profile from 'src/components/ui/Profile';
import { useApi } from 'src/hooks/useApi';
import { DataContext } from 'src/context/DataProvider';
import { CommonContext } from 'src/context/CommonProvider';

const ProfilePage = () => {
    const { getMe } = useApi();
    const {
        data: { user },
    } = useContext(DataContext);
    const { loadersState } = useContext(CommonContext);

    useEffect(() => {
        getMe();
    }, [getMe]);

    return <Profile user={user} profile loading={loadersState.me} />;
};

export default memo(ProfilePage);
