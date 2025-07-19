import { createBrowserRouter } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import ClientRoutes from './ClientRoutes';
import Page403 from '@/components/Admin/Page403';
const SystemRoutes = [
{
path: "/403",
element: <Page403 />
},
];

const router = createBrowserRouter(
[
ClientRoutes,
AdminRoutes,
...SystemRoutes
],
{
basename: import.meta.env.VITE_APP_BASE_NAME,
}
);

export default router;