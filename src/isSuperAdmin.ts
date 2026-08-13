import type { PayloadRequest } from 'payload';

export const isSuperAdmin = ({ req }: { req: PayloadRequest }): boolean => {
  return Boolean(req.user?.roles?.includes('super-admin'));
};