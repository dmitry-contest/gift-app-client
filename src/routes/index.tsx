import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from 'react-router-dom';
import Layout from 'src/components/Layout';
import Error from 'src/components/pages/Error';
import {
    BUY_PAGE,
    CONFIRMATION_PAGE,
    GIFTS_PAGE,
    LEADERBOARD_PAGE,
    LEADERBOARD_PROFILE_PAGE,
    PROFILE_PAGE,
    PROFILE_RECENT_ACTIONS,
    STORE_PAGE,
} from 'src/constants/menu';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Navigate to={`/${STORE_PAGE}`} replace />,
            },
            {
                path: STORE_PAGE,
                lazy: () => import('src/routes/store'),
                children: [
                    {
                        path: `${BUY_PAGE}/:id`,
                        lazy: () => import('src/routes/buy'),
                    },
                ],
            },
            {
                path: GIFTS_PAGE,
                lazy: () => import('src/routes/gifts'),
            },
            {
                path: LEADERBOARD_PAGE,
                lazy: () => import('src/routes/leaderboard'),
                children: [
                    {
                        path: `${LEADERBOARD_PROFILE_PAGE}/:id`,
                        lazy: () => import('src/routes/leaderboardProfile'),
                    },
                ],
            },
            {
                path: PROFILE_PAGE,
                lazy: () => import('src/routes/profile'),
                children: [
                    {
                        path: PROFILE_RECENT_ACTIONS,
                        lazy: () => import('src/routes/recentactions'),
                    },
                ],
            },
            {
                path: CONFIRMATION_PAGE,
                lazy: () => import('src/routes/confirmation'),
            },
        ],
    },
]);

export const Router = () => {
    return <RouterProvider router={router} />;
};
