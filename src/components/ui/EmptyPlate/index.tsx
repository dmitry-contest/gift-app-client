import { memo, FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { STORE_PAGE } from 'src/constants/menu';
import Balloons from 'src/icons/balloons.svg?react';

import s from './EmptyPlate.module.scss';

interface IEmptyPlateProps {
    readonly text: string;
}

const EmptyPlate: FC<IEmptyPlateProps> = props => {
    const { text } = props;

    const { t } = useTranslation();

    return (
        <div className={s.container}>
            <Balloons />
            <span className={s.emptyGiftsText}>{text}</span>
            <Link className={s.link} to={`/${STORE_PAGE}`}>
                {t('openStore')}
            </Link>
        </div>
    );
};

export default memo(EmptyPlate);
