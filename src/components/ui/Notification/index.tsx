import { FC, memo, useEffect } from 'react';
import { useLottieGift } from 'src/hooks/useLottieGift';
import cn from 'classnames';

import s from './Notification.module.scss';

interface INotificationAction {
    readonly text: string;
    readonly callback: () => void;
}

interface INotificationProps {
    readonly title: string;
    readonly description: string;
    readonly action: INotificationAction;
    readonly lottieName: string;
    readonly className?: string;
    readonly duration?: number;
    readonly onClose: () => void;
}

const Notification: FC<INotificationProps> = props => {
    const {
        title,
        lottieName,
        description,
        className,
        action,
        duration = 5000,
        onClose,
    } = props;

    const { View } = useLottieGift(lottieName, { className: s.lottie });

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={cn([s.container, className])}>
            {View}
            <div className={s.text}>
                <span className={s.title}>{title}</span>
                <span className={s.description}>{description}</span>
            </div>
            <button
                type="button"
                className={s.action}
                onClick={action.callback}
            >
                {action.text}
            </button>
        </div>
    );
};

export default memo(Notification);
