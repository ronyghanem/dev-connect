import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  const sessionEmail = session?.user?.email?.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  const isAdmin =
    !!sessionEmail &&
    !!adminEmail &&
    sessionEmail === adminEmail;

  return {
    session,
    isAdmin,
  };
}