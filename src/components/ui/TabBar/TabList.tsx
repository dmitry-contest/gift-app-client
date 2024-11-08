import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { getMenu } from 'src/utils/getMenu';
import Tab from 'src/components/ui/TabBar/Tab';

import s from './TabBar.module.scss';

const menu = getMenu();

const TabList = () => {
    const location = useLocation();

    return (
        <div className={s.menuItems}>
            {menu.map(menuItem => {
                const isLinkSelected = location.pathname.startsWith(
                    menuItem.route,
                );

                return (
                    <Tab
                        key={menuItem.name}
                        isLinkSelected={isLinkSelected}
                        item={menuItem}
                    />
                );
            })}
        </div>
    );
};

export default memo(TabList);
