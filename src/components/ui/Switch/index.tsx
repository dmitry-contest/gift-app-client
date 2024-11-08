import { ElementType, memo, FC, useCallback } from 'react';
import cn from 'classnames';

import s from './Switch.module.scss';

export interface ISwitchOption {
    readonly value: string;
    readonly element: ElementType;
}

export type TSwitchOptions = Array<ISwitchOption>;

interface ISwitchProps {
    readonly selectedOption: string;
    readonly options: TSwitchOptions;
    readonly onChangeOption: (option: string) => void;
    readonly className?: string;
}

const Switch: FC<ISwitchProps> = props => {
    const { selectedOption, options, onChangeOption, className } = props;

    const handleOptionClick = useCallback(
        (value: string) => {
            if (selectedOption === value) {
                return;
            }

            onChangeOption(value);
        },
        [selectedOption, onChangeOption],
    );

    return (
        <div className={cn([s.container, className])}>
            {options.map(option => {
                return (
                    <button
                        key={option.value}
                        type="button"
                        className={cn([
                            s.item,
                            option.value === selectedOption && s.selectedItem,
                        ])}
                        onClick={() => handleOptionClick(option.value)}
                    >
                        <option.element />
                    </button>
                );
            })}
        </div>
    );
};

export default memo(Switch);
