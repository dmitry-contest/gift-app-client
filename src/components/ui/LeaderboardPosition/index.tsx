import { FC, memo } from 'react';
import GoldMedalIcon from 'src/icons/medals/gold.png';
import SilverMedalIcon from 'src/icons/medals/silver.png';
import BronzeMedalIcon from 'src/icons/medals/bronze.png';

import s from './LeaderboardPosition.module.scss';

interface ILeaderboardPositionProps {
    readonly position: number;
}

const LeaderboardPosition: FC<ILeaderboardPositionProps> = props => {
    const { position } = props;

    return (
        {
            1: <img src={GoldMedalIcon} alt="gold" className={s.icon} />,
            2: <img src={SilverMedalIcon} alt="silver" className={s.icon} />,
            3: <img src={BronzeMedalIcon} alt="bronze" className={s.icon} />,
        }[position] || <span className={s.text}>#{position}</span>
    );
};

export default memo(LeaderboardPosition);
