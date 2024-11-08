import { memo, FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { formatAmount } from 'src/utils/formatAmount';

import s from './GiftsAmount.module.scss';

interface IGiftsAmountProps {
    readonly amount: number;
    readonly available: number;
    readonly withBackground?: boolean;
    readonly className?: string;
    readonly skipFormat?: boolean;
}

const GiftsAmount: FC<IGiftsAmountProps> = props => {
    const {
        available,
        withBackground,
        amount,
        className,
        skipFormat = false,
    } = props;

    const { t } = useTranslation();

    return (
        <span className={cn([className, withBackground && s.withBackground])}>
            {t('giftsAmount', {
                amount: skipFormat
                    ? amount.toLocaleString()
                    : formatAmount(amount),
                available: skipFormat
                    ? available.toLocaleString()
                    : formatAmount(available),
            })}
        </span>
    );
};

export default memo(GiftsAmount);
