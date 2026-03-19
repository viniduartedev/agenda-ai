import { createBrowserRouter } from 'react-router-dom';
import { BookingPage } from '@/pages/BookingPage';
import { BookingSuccessPage } from '@/pages/BookingSuccessPage';
import { HomePage } from '@/pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/agendar/:slug',
    element: <BookingPage />,
  },
  {
    path: '/agendar/:slug/sucesso',
    element: <BookingSuccessPage />,
  },
]);
