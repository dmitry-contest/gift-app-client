import { TStoreData, TUserData } from 'src/context/DataProvider';
import { getStoreGiftById } from 'src/utils/getStoreGiftById';
import { getDateTime } from 'src/utils/getDateTime';
import { TRecentActions } from 'src/components/pages/RecentActions';

export const prepareRecentActions = (
    user: TUserData | undefined,
    store: TStoreData,
) => {
    if (!user) {
        return [];
    }

    const received: TRecentActions = user.gifts.received.flatMap(
        receivedItem => {
            const gift = getStoreGiftById(store, String(receivedItem.giftId));
            if (!gift) {
                return [];
            }

            return [
                {
                    initialDate: receivedItem.date,
                    type: 'received',
                    giftName: gift.name,
                    ...getDateTime(receivedItem.date),
                    user: receivedItem.tgUser,
                },
            ];
        },
    );

    const paid: TRecentActions = user.gifts.paid.flatMap(paidItem => {
        const gift = getStoreGiftById(store, String(paidItem.giftId));

        if (!gift) {
            return [];
        }

        return [
            {
                initialDate: paidItem.date,
                type: 'paid',
                giftName: gift.name,
                ...getDateTime(paidItem.date),
                price: gift.price,
                currency: gift.currency,
            },
        ];
    });

    const sent: TRecentActions = user.gifts.sent.flatMap(sentItem => {
        const gift = getStoreGiftById(store, String(sentItem.giftId));
        if (!gift) {
            return [];
        }

        return [
            {
                initialDate: sentItem.date,
                type: 'sent',
                giftName: gift.name,
                ...getDateTime(sentItem.date),
                user: sentItem.tgUser,
            },
        ];
    });

    return [...paid, ...sent, ...received].reduce(
        (acc, recentAction) => {
            return {
                ...acc,
                ...(acc[recentAction.date]
                    ? {
                          [recentAction.date]: [
                              ...acc[recentAction.date],
                              recentAction,
                          ],
                      }
                    : {
                          [recentAction.date]: [recentAction],
                      }),
            };
        },
        {} as { [key: string]: TRecentActions },
    );
};
