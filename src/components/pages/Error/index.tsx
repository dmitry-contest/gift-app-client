import Button from 'src/components/ui/Button';
import { FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORE_PAGE } from 'src/constants/menu';
import { CommonContext } from 'src/context/CommonProvider';

import s from './Error.module.scss';

interface IErrorProps {
    readonly message?: string;
}

const Error: FC<IErrorProps> = props => {
    const { message } = props;
    const { setError } = useContext(CommonContext);

    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        setError(undefined);
        navigate(STORE_PAGE);
    }, [navigate, setError]);

    return (
        <div className={s.error}>
            <span className="title1">{message || 'Something went wrong.'}</span>
            <Button onClick={handleClick}>Back to Store page</Button>
        </div>
    );
};

export default Error;
