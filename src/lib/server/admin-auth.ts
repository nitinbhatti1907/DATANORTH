import { redirect } from "next/navigation";

export type AdminSession = {
  userId: string;
  email?: string;
  mode: "setup" | "authenticated";
};

function getAllowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!process.env.CLERK_SECRET_KEY) {
    return { userId: "setup-mode", mode: "setup" };
  }

  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const session = await auth();
  if (!session.userId) return null;

  const allowedEmails = getAllowedAdminEmails();
  if (!allowedEmails.size) {
    return { userId: session.userId, mode: "authenticated" };
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses.find((address) => address.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress;

  if (!email || !allowedEmails.has(email.toLowerCase())) {
    return null;
  }

  return { userId: session.userId, email, mode: "authenticated" };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (session) return session;

  if (process.env.CLERK_SECRET_KEY) {
    const { auth } = await import("@clerk/nextjs/server");
    const clerkSession = await auth();
    if (clerkSession.userId) redirect("/admin/unauthorized");
  }

  redirect("/sign-in");
}
