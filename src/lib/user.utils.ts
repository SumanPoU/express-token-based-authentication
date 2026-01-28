import db from '../config/prisma';

/**
 * Check if a user with given email or username exists
 * @param email
 * @param userName
 * @returns boolean
 */
export const isUserExists = async (email: string, userName?: string): Promise<boolean> => {
  const user = await db.user.findFirst({
    where: {
      OR: [{ email }, { userName }],
    },
  });
  return !!user;
};

/**
 * Get the default role ID from Role table
 * @returns string | null
 */
export const getDefaultRoleId = async (): Promise<string | null> => {
  const defaultRole = await db.role.findFirst({
    where: { isDefault: true },
  });
  return defaultRole?.id ?? null;
};
