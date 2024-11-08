import { TStoreData } from 'src/context/DataProvider';

export const getStoreGiftById = (store: TStoreData, id: string | undefined) => {
    return id !== undefined ? store.find(item => item.id === +id) : undefined;
};
