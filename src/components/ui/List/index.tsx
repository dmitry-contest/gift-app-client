import { FC, memo, ReactNode, Ref } from 'react';
import cn from 'classnames';
import ListItem from 'src/components/ui/List/ListItem';

import s from './List.module.scss';

export interface IListItem {
    readonly key: string;
    readonly icon: ReactNode;
    readonly title: ReactNode;
    readonly description: ReactNode;
    readonly rightAddon?: ReactNode;
    readonly pinRef?: Ref<HTMLDivElement>;
}

export type TListData = Array<IListItem>;

interface IListProps {
    readonly data: TListData;
    readonly className?: string;
    readonly onClick?: (item: IListItem) => void;
}

const List: FC<IListProps> = props => {
    const { data, className, onClick } = props;

    return (
        <div className={cn([s.container, className])}>
            {data.map(item => (
                <ListItem
                    key={item.key}
                    item={item}
                    pinRef={item.pinRef}
                    onClick={onClick}
                />
            ))}
        </div>
    );
};

export default memo(List);
