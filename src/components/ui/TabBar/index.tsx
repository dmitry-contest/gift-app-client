import TabList from 'src/components/ui/TabBar/TabList.tsx';
import { memo } from 'react';

import s from './TabBar.module.scss';

const TabBar = () => {
    return (
        <div className={s.container}>
            <TabList />
            <div className={s.homeIndicator} />
        </div>
    );
};

export default memo(TabBar);
