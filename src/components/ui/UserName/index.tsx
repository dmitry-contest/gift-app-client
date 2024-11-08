import { FC, memo, ReactNode } from 'react';
import Premium from 'src/icons/premium.svg?react';
import cn from 'classnames';

import s from './UserName.module.scss';

interface IUserNameProps {
    readonly firstName: string | null | undefined;
    readonly lastName: string | null | undefined;
    readonly showPremiumIcon?: boolean;
    readonly textClassName?: string;
    readonly customSign?: ReactNode;
}

const UserName: FC<IUserNameProps> = props => {
    const {
        firstName,
        lastName,
        showPremiumIcon = false,
        textClassName,
        customSign,
    } = props;

    return (
        <div className={s.container}>
            <span className={cn([textClassName || s.text])}>
                {firstName}
                {lastName ? ` ${lastName}` : ''}
            </span>
            {showPremiumIcon && <Premium />}
            {customSign}
        </div>
    );
};

export default memo(UserName);
