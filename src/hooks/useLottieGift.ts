import { useEffect, useState } from 'react';
import { useLottie } from 'lottie-react';

interface ILottieGiftOptions {
    readonly className?: string;
    readonly loop?: boolean;
}

export const useLottieGift = (name: string, options?: ILottieGiftOptions) => {
    const { className, loop = false } = options || {};
    const [animationData, setAnimationData] = useState();

    useEffect(() => {
        const loadLottie = async () => {
            try {
                const result = await import(`src/icons/lottie/${name}.json`);
                if (result.default) {
                    setAnimationData(result.default);
                }
            } catch (e) {
                console.error(e);
            }
        };

        loadLottie();
    }, [name]);

    const { View, stop, play } = useLottie({
        animationData,
        loop,
        className,
    });

    return {
        View,
        stopAnimation: stop,
        playAnimation: play,
        loaded: animationData !== undefined,
    };
};
