import { memo, FC, PropsWithChildren } from 'react';
import cn from 'classnames';

import s from './Button.module.scss';

interface IButtonProps {
    readonly onClick: () => void;
    readonly className?: string;
    readonly disabled?: boolean;
}

const Button: FC<PropsWithChildren<IButtonProps>> = props => {
    const { className, onClick, children, disabled } = props;

    return (
        <button
            type="submit"
            onClick={onClick}
            className={cn([s.button, className, disabled && s.disabled])}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default memo(Button);
