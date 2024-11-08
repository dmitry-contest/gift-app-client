import { MENU_LIST } from 'src/constants/menu';

export interface IMenuItem {
    readonly route: string;
    readonly name: string;
}

export type TMenu = Array<IMenuItem>;

export const getMenu = (): TMenu => {
    return MENU_LIST.map(menu => ({
        route: `/${menu}`,
        name: menu,
    }));
};
