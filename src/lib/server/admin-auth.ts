import { redirect } from "next/navigation";

export type AdminSession = {
  userId: string;
  mode: "setup" | "authenticated";
};

export async function requireAdminSession(): Promise<AdminSession> {
  if (!process.env.CLERK_SECRET_KEY) {
    return { userId: "setup-mode", mode: "setup" };
  }

  const { auth } = await import("@clerk/nextjs/server");
  const session = await auth();
  if (!session.userId) redirect("/sign-in");
  return { userId: session.userId, mode: "authenticated" };
}
