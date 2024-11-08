import { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';

import Star1 from 'src/icons/stars/star1.svg';
import Star2 from 'src/icons/stars/star2.svg';
import Star3 from 'src/icons/stars/star3.svg';
import Star4 from 'src/icons/stars/star4.svg';

import s from './Stars.module.scss';

interface IStarsProps {
    readonly className?: string;
}

const starCount = 100;
const starSpeed = 0.2;
const starSVGPaths = [Star1, Star2, Star3, Star4];

const Stars: FC<IStarsProps> = props => {
    const { className } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const starImages: Array<HTMLImageElement> = useMemo(() => [], []);

    const startAnimation = useCallback(
        (canvas: HTMLCanvasElement) => {
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            interface Star {
                x: number;
                y: number;
                angle: number;
                speed: number;
                size: number;
                img: HTMLImageElement;
            }

            let stars: Star[] = [];

            function createStar(): Star {
                const angle = Math.random() * 2 * Math.PI;
                const img =
                    starImages[Math.floor(Math.random() * starImages.length)];
                return {
                    x: centerX,
                    y: centerY,
                    angle,
                    speed: starSpeed + Math.random() * 2,
                    size: 10 + Math.random() * 10,
                    img,
                };
            }

            function updateStars() {
                stars = stars.filter(
                    star =>
                        star.x > -star.size &&
                        star.x < canvas.width + star.size &&
                        star.y > -star.size &&
                        star.y < canvas.height + star.size,
                );

                while (stars.length < starCount) {
                    stars.push(createStar());
                }

                stars.forEach(star => {
                    // eslint-disable-next-line no-param-reassign
                    star.x += Math.cos(star.angle) * star.speed;
                    // eslint-disable-next-line no-param-reassign
                    star.y += Math.sin(star.angle) * star.speed;
                });
            }

            function drawStars() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                stars.forEach(star => {
                    ctx.drawImage(
                        star.img,
                        star.x - star.size / 2,
                        star.y - star.size / 2,
                        star.size,
                        star.size,
                    );
                });
            }

            function animate() {
                updateStars();
                drawStars();
                requestAnimationFrame(animate);
            }

            animate();
        },
        [starImages],
    );

    useEffect(() => {
        starSVGPaths.forEach(path => {
            const img = new Image();
            img.src = path;
            starImages.push(img);
        });

        Promise.all(
            starImages.map(
                // eslint-disable-next-line no-return-assign
                img =>
                    new Promise(resolve => {
                        // eslint-disable-next-line no-param-reassign
                        img.onload = resolve;
                    }),
            ),
        ).then(() => {
            if (canvasRef.current) {
                startAnimation(canvasRef.current);
            }
        });
    }, [starImages, startAnimation]);

    return <canvas ref={canvasRef} className={cn([s.canvas, className])} />;
};

export default memo(Stars);
