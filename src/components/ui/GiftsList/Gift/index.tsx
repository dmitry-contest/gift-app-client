import { ReactNode, useCallback } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { TGiftSize } from 'src/components/ui/GiftsList';
import Avatar from 'src/components/ui/Avatar';
import { GIFT_SIZE_LG, GIFT_SIZE_MD } from 'src/constants/gifts';
import GiftsAmount from 'src/components/ui/GiftsAmount';
import Button from 'src/components/ui/Button';
import Pattern from 'src/icons/pattern-small.svg?react';
import PatternLight from 'src/icons/pattern-light.svg?react';
import { useLottieGift } from 'src/hooks/useLottieGift';
import { TGiftsPageGiftItem, TProfileGift } from 'src/types/api';
import { TStoreItem } from 'src/context/DataProvider';

import s from './Gift.module.scss';

export interface IGiftOptionAction {
    readonly name: ReactNode;
    readonly disabled?: boolean;
}

export interface IGiftOptions {
    readonly withGiftName?: boolean;
    readonly className?: string;
    readonly lottieClassName?: string;
    readonly nameClassName?: string;
    readonly withHeader?: boolean;
    readonly action?: IGiftOptionAction;
    readonly withPattern?: boolean;
}

interface IGiftProps<T> {
    readonly data: T;
    readonly onClick?: (gift: T) => void;
    readonly size: TGiftSize;
    readonly options?: IGiftOptions;
}

export default <T extends TProfileGift | TGiftsPageGiftItem | TStoreItem>(
    props: IGiftProps<T>,
) => {
    const { data, onClick, size, options } = props;

    const {
        withGiftName,
        className,
        lottieClassName,
        nameClassName,
        withHeader = true,
        action,
        withPattern,
    } = options || {};

    const { View: LottieView } = useLottieGift(`gift-${data.name}`, {
        loop: true,
        className: cn([s[`lottie-${size}`], lottieClassName]),
    });

    const { t } = useTranslation();

    const handleClick = useCallback(() => {
        if (!options?.action?.disabled && onClick) {
            onClick(data);
        }
    }, [data, onClick, options?.action?.disabled]);

    return (
        <div
            className={cn([
                s.container,
                withPattern ? s[`pattern-${data.name}`] : s.withoutPattern,
                s[`size-${size}`],
                className,
            ])}
            onClick={handleClick}
        >
            {withPattern &&
                (GIFT_SIZE_LG === size ? (
                    <PatternLight className={s.patternLight} />
                ) : (
                    <Pattern className={s.pattern} />
                ))}
            {withHeader && (
                <div className={s.header}>
                    {![GIFT_SIZE_LG, GIFT_SIZE_MD].includes(size) &&
                        'tgUser' in data && (
                            <Avatar
                                firstName={data.tgUser.firstName}
                                lastName={data.tgUser.lastName}
                                size={16}
                                url={data.tgUser.avatarUrl}
                            />
                        )}
                    <GiftsAmount
                        className={cn([s.amount, s[`amount-${size}`]])}
                        amount={data.amount}
                        available={data.amountSold}
                    />
                </div>
            )}
            {LottieView}
            {withGiftName && (
                <span
                    className={cn([s.name, s[`name-${size}`], nameClassName])}
                >
                    {t(`gifts.${data.name}`)}
                </span>
            )}
            {action && (
                <Button
                    className={s[`button-${size}`]}
                    onClick={handleClick}
                    disabled={action.disabled}
                >
                    {action.name}
                </Button>
            )}
        </div>
    );
};
