import { memo } from 'react';

import s from './Separator.module.scss';

const Separator = () => {
    return <div className={s.separator} />;
};

export default memo(Separator);
