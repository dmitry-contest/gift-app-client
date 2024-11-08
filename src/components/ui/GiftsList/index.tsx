import { GIFT_SIZE_LG, GIFT_SIZE_MD, GIFT_SIZE_SM } from 'src/constants/gifts';
import Gift, { IGiftOptions } from 'src/components/ui/GiftsList/Gift';
import cn from 'classnames';
import { TGiftsPageGiftItem, TProfileGift } from 'src/types/api';
import { TStoreItem } from 'src/context/DataProvider';

import s from './GiftsList.module.scss';

export type TGiftSize =
    | typeof GIFT_SIZE_MD
    | typeof GIFT_SIZE_SM
    | typeof GIFT_SIZE_LG;

interface IGiftsListProps<T> {
    readonly size: TGiftSize;
    readonly data: Array<T>;
    readonly onClick?: (gift: T) => void;
    readonly options: IGiftOptions;
    readonly getData: (gift: T) => {
        key: string;
        giftOptions?: Pick<IGiftOptions, 'action'>;
    };
}

export default <T extends TProfileGift | TGiftsPageGiftItem | TStoreItem>(
    props: IGiftsListProps<T>,
) => {
    const { size, data, onClick, options, getData } = props;

    return (
        <div className={cn([s.container, s[`size-${size}`]])}>
            {data.map(gift => {
                const { key, giftOptions } = getData(gift);
                const allOptions = { ...options, ...(giftOptions ?? {}) };

                return (
                    <Gift<T>
                        size={size}
                        key={key}
                        data={gift}
                        onClick={onClick}
                        options={allOptions}
                    />
                );
            })}
        </div>
    );
};
