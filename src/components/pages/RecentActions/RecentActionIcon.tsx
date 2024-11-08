import { memo, FC } from 'react';
import { TRecentAction } from 'src/components/pages/RecentActions/index';
import { useLottieGift } from 'src/hooks/useLottieGift';
import BuyIcon from 'src/icons/buy.svg?react';
import ReceiveIcon from 'src/icons/receive.svg?react';
import SentIcon from 'src/icons/sent.svg?react';

import s from './RecentActions.module.scss';
import cn from 'classnames';

interface IRecentActionIconProps {
    readonly giftName?: string;
    readonly avatarUrl?: string | null;
    readonly type: TRecentAction['type'];
}

const icon = {
    sent: <SentIcon width={10} height={10} />,
    received: <ReceiveIcon width={10} height={10} />,
    paid: <BuyIcon width={10} height={10} />,
};

const RecentActionIcon: FC<IRecentActionIconProps> = props => {
    const { giftName, avatarUrl, type } = props;

    const { View, loaded } = useLottieGift(`gift-${giftName}`, {
        className: s.lottieGift,
        loop: true,
    });

    return (
        <div className={cn([s.lottie, avatarUrl && s.avatar])}>
            {loaded && View}
            {avatarUrl && <img src={avatarUrl} alt="" />}
            <div className={s[`${type}Icon`]}>{icon[type]}</div>
        </div>
    );
};

export default memo(RecentActionIcon);
