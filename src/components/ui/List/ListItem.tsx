import { FC, memo, Ref } from 'react';
import { IListItem } from 'src/components/ui/List/index';
import cn from 'classnames';

import s from './List.module.scss';

interface IListItemProps {
    readonly item: IListItem;
    readonly listItemClassName?: string;
    readonly pinRef?: Ref<HTMLDivElement>;
    readonly onClick?: (item: IListItem) => void;
}

const ListItem: FC<IListItemProps> = props => {
    const { item, listItemClassName, pinRef, onClick } = props;

    return (
        <div
            className={cn([s.listItem, listItemClassName])}
            ref={pinRef}
            {...(onClick ? { onClick: () => onClick(item) } : {})}
        >
            {item.icon}
            <div className={s.content}>
                <div className={s.main}>
                    {item.title}
                    {item.description}
                </div>
                {item.rightAddon}
            </div>
        </div>
    );
};

export default memo(ListItem);
