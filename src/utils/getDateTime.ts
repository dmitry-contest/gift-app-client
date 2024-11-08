import type { UserLanguage } from 'src/types/api';
import { EN, RU } from 'src/constants/languages';

const monthsGenitiveRu = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
];

const monthsGenitiveEn = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const monthsGenitive = {
    [RU]: monthsGenitiveRu,
    [EN]: monthsGenitiveEn,
};

const addZero = (value: number) => {
    return value < 10 ? `0${value}` : value;
};

const omitZero = (value: string) => {
    const [first, second] = value.split('');

    return first !== '0' ? value : second;
};

export const getDateTime = (dateString: Date) => {
    const date = new Date(dateString);

    return {
        date: `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${addZero(date.getFullYear())}`,
        time: `${addZero(date.getHours())}:${addZero(date.getMinutes())}`,
    };
};

export const formatGenitiveDayMonth = (date: string, locale: UserLanguage) => {
    const [day, month] = date.split('.');

    return `${omitZero(day)} ${monthsGenitive[locale][+month - 1].toUpperCase()}`;
};
