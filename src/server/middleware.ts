import { getUserProfile, isAuthenticated } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { refreshTokenIfNecessary } from './utils';

export const KindeAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    throw redirect({
      to: '/api/auth/login',
    });
  }

  const refreshResult = await refreshTokenIfNecessary();

  if (!refreshResult.success) {
    throw redirect({
      to: '/api/auth/login',
    });
  }

  const user = await getUserProfile();
  return next({
    context: {
      user,
    },
  });
});
