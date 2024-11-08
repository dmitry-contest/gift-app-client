import { TStoreItem } from 'src/context/DataProvider';
import type { sdk } from '@tg-gift-app/api-sdk';

export type TUserData = selectResponse<sdk['api']['me'], 200>['user'];

export type TUserReceivedGifts = TUserData['gifts']['received'];

export type TUserPaidGifts = TUserData['gifts']['paid'];

export type TUserPaidGift = TUserPaidGifts extends (infer PaidGift)[]
    ? PaidGift
    : unknown;

export type TUserReceivedGift =
    TUserReceivedGifts extends (infer UserReceivedGift)[]
        ? UserReceivedGift
        : unknown;

export type TProfileGift = TStoreItem & TUserReceivedGift;

export type TApiTgUser = TUserReceivedGift['tgUser'];

export type TProfileGifts = Array<TProfileGift>;

export type TGiftsPageGiftItem = TUserPaidGift & TStoreItem;

export type TGiftsPageGiftData = Array<TGiftsPageGiftItem>;

export type TReceivedGift = selectResponse<sdk['api']['giftReceived'], 200>;

export enum UserLanguage {
    EN = 'en',
    RU = 'ru',
}

export type TStoreGiftInfo = selectResponse<sdk['api']['storeGiftInfo'], 200>;
