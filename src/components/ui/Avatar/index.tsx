import { memo, FC } from 'react';
import cn from 'classnames';

import s from './Avatar.module.scss';

export interface IAvatarProps {
    readonly url?: string | null;
    readonly rate?: number | null;
    readonly size?: 16 | 20 | 40;
    readonly className?: string;
    readonly firstName: string | null | undefined;
    readonly lastName: string | null | undefined;
}

const Avatar: FC<IAvatarProps> = props => {
    const { url, rate, size, className, firstName, lastName } = props;

    const sizeClassName = size && s[`size-${size}`];

    const nameLetters = `${firstName?.[0]}${lastName ? lastName[0] : ''}`;

    return (
        <div className={cn([s.container, className])}>
            {url ? (
                <img className={cn([s.img, sizeClassName])} src={url} alt="" />
            ) : (
                <div className={cn([s.img, s.emptyImg, sizeClassName])}>
                    {nameLetters}
                </div>
            )}
            {rate && (
                <div className={cn([s.rate, rate === 1 && s.gold])}>
                    #{rate}
                </div>
            )}
        </div>
    );
};

export default memo(Avatar);
