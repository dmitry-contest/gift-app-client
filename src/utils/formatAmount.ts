export const formatAmount = (value: number): string | number => {
    if (value < 1000) {
        return value;
    }

    const divided = value / 1000;

    return `${divided}K`;
};
