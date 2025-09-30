import { createMiddleware } from '@tanstack/react-start';
import { handleKindeMiddleware } from './shared';

export const KindeAuthMiddleware = createMiddleware().server(async ({ request, next }) => {
  return handleKindeMiddleware(request, next);
});

