import { TStoreData, TUserData } from 'src/context/DataProvider';

export const findGiftByInvoice = (
    invoice: string,
    store: TStoreData,
    user: TUserData | undefined,
) => {
    const giftId = user?.gifts?.paid?.find(
        gift => gift.hash === invoice,
    )?.giftId;

    return store.find(gift => gift.id === giftId);
};
