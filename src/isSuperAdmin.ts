import type { AccessArgs } from 'payload';
import type { User } from '@/payload-types';

export const isSuperAdmin = ({ req }: AccessArgs<User>): boolean => {
  return Boolean(req.user?.roles?.includes('super-admin'));
};