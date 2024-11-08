import { memo, FC, useEffect, useState, useCallback } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLottie } from 'lottie-react';
import { Link } from 'react-router-dom';
import { IMenuItem } from 'src/utils/getMenu';

import s from './TabBar.module.scss';

interface ITabProps {
    readonly isLinkSelected: boolean;
    readonly item: IMenuItem;
}

const Tab: FC<ITabProps> = props => {
    const { isLinkSelected, item } = props;

    const [animationData, setAnimationData] = useState();

    const { t } = useTranslation('common');

    useEffect(() => {
        const getLottie = async () => {
            const result = await import(
                `src/icons/lottie/tab-${item.name}.json`
            );
            setAnimationData(result?.default);
        };

        getLottie();
    }, [item.name]);

    const { View, play, stop } = useLottie(
        {
            animationData,
            autoplay: false,
            loop: false,
            className: cn([s.lottie, isLinkSelected && s.selectedIcon]),
        },
        {},
    );

    const handleClick = useCallback(() => {
        stop();
        play();
    }, [stop, play]);

    return (
        <div className={s.item}>
            <Link
                to={item.route}
                className={cn([s.link, isLinkSelected && s.selectedLink])}
                onClick={handleClick}
            >
                {View}
                <span>{t(`menu.${item.name}`)}</span>
            </Link>
        </div>
    );
};

export default memo(Tab);
