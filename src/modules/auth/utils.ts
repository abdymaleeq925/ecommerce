import { cookies, cookies as getCookies } from "next/headers";

interface AuthCookieProps {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({
  prefix,
  value,
}: AuthCookieProps) => {
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Ensure cross-domain cookie sharing
    // sameSite: "none",
    // domain: ""
  });
};

export async function clearAuthCookie({ prefix }: { prefix?: string }) {
  const cookieName = `${prefix || "payload"}-token`;
  const cookieStore = await cookies();

  cookieStore.delete(cookieName);
}
