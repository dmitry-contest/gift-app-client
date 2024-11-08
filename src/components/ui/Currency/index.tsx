import { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import USDT from 'src/icons/currencies/USDT.svg?react';
import TON from 'src/icons/currencies/TON.svg?react';
import ETH from 'src/icons/currencies/ETH.svg?react';
import USDT_WITH_BG from 'src/icons/currencies/USDT_bg.svg?react';
import ETH_WITH_BG from 'src/icons/currencies/ETH_bg.svg?react';
import TON_WITH_BG from 'src/icons/currencies/TON_bg.svg?react';
import {
    CURRENCY_USDT,
    CURRENCY_ETH,
    CURRENCY_TON,
} from 'src/constants/currencies';

import s from './Currency.module.scss';

interface ICurrencyProps {
    readonly price: number;
    readonly currency: string;
    readonly inverted?: boolean;
    readonly iconSize?: number;
    readonly className?: string;
}

const Currency: FC<ICurrencyProps> = props => {
    const { price, currency, inverted, iconSize = 24, className } = props;
    const iconProps = useMemo(
        () => ({ width: iconSize, height: iconSize }),
        [iconSize],
    );

    return (
        <div className={cn([s.currency, inverted && s.inverted, className])}>
            {inverted
                ? {
                      [CURRENCY_USDT]: <USDT_WITH_BG {...iconProps} />,
                      [CURRENCY_TON]: <TON_WITH_BG {...iconProps} />,
                      [CURRENCY_ETH]: <ETH_WITH_BG {...iconProps} />,
                  }[currency]
                : {
                      [CURRENCY_USDT]: <USDT {...iconProps} />,
                      [CURRENCY_TON]: <TON {...iconProps} />,
                      [CURRENCY_ETH]: <ETH {...iconProps} />,
                  }[currency]}
            {price} {currency}
        </div>
    );
};

export default memo(Currency);
