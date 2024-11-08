import { memo } from 'react';
import cn from 'classnames';

import s from './Loader.module.scss';

const Loader = () => {
    return <div className={cn([s.loader, 'title1'])}>Loading...</div>;
};

export default memo(Loader);
