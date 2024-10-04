// src/routes/index.tsx
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '../App';
import ProtectedRoutes from './ProtectedRoutes';
import LayoutLoader from '../components/LayoutLoader/LayoutLoader';




const Auth = lazy(() => import('../pages/Auth'));
 const Home = lazy(() => import('../pages/Home/Home'));
 const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'auth',
        element: (
          <Suspense fallback={<LayoutLoader/>}>
            <Auth />
          </Suspense>
        ),
      },
      {

        element: <ProtectedRoutes />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LayoutLoader/>}>
                <Home />
              </Suspense>
            ),
          },
        //   {
        //     path: 'dashboard',
        //     element: (
        //       <Suspense fallback={<div>Loading...</div>}>
        //         <Dashboard />
        //       </Suspense>
        //     ),
        //   },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LayoutLoader/>}>
            <NotFound/>
          </Suspense>
        ),
      },
    ],
  },
];

export const AppRouter = createBrowserRouter(routes);
