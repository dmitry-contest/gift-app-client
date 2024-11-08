import { FC, memo, PropsWithChildren } from 'react';
import CloseIcon from 'src/icons/close.svg?react';

import s from './Modal.module.scss';

interface IModalProps {
    readonly onClose: () => void;
}

const Modal: FC<PropsWithChildren<IModalProps>> = props => {
    const { onClose, children } = props;

    return (
        <div className={s.overlay}>
            <div className={s.content}>
                <button type="button" onClick={onClose} className={s.closeBtn}>
                    <CloseIcon />
                </button>
                {children}
            </div>
        </div>
    );
};

export default memo(Modal);
