import { FC, memo, useCallback, ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from 'src/icons/search.svg?react';
import cn from 'classnames';

import s from './Search.module.scss';

interface ISearchProps {
    readonly value: string;
    readonly onChange: (value: string) => void;
}

const Search: FC<ISearchProps> = props => {
    const { value, onChange } = props;
    const [focused, setFocused] = useState(false);

    const { t } = useTranslation();

    const handleFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
    }, []);

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        [onChange],
    );

    return (
        <div className={cn(['text', s.container])}>
            {!focused && !value ? (
                <div className={s.placeholder}>
                    <SearchIcon className={s.icon} />
                    <span>{t('search')}</span>
                </div>
            ) : (
                <SearchIcon className={s.icon} />
            )}

            <input
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={s.input}
                type="text"
                onChange={handleChange}
                value={value}
                autoComplete="off"
            />
        </div>
    );
};

export default memo(Search);
