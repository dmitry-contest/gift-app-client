import { FC, memo, useCallback, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBackButton } from 'src/hooks/useBackButton';
import { useApi } from 'src/hooks/useApi';
import { DataContext } from 'src/context/DataProvider';
import Profile from 'src/components/ui/Profile';
import { CommonContext } from 'src/context/CommonProvider';

const LeaderboardProfile: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notMe } = useApi();
    const {
        data: { notMe: user },
    } = useContext(DataContext);
    const { loadersState } = useContext(CommonContext);

    const handleBack = useCallback(() => {
        navigate('..');
    }, [navigate]);

    const { showBackButton, hideBackButton } = useBackButton(handleBack);

    useEffect(() => {
        if (id) {
            notMe(id);
        }
    }, [notMe, id]);

    useEffect(() => {
        showBackButton();

        return () => hideBackButton();
    }, [showBackButton, hideBackButton]);

    return <Profile user={user} loading={loadersState.notMe} />;
};

export default memo(LeaderboardProfile);
