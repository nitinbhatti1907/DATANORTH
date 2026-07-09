import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkSetupMessage />;
  }

  return (
    <div className="content-container flex min-h-[70vh] items-center justify-center py-12">
      <SignUp />
    </div>
  );
}

function ClerkSetupMessage() {
  return (
    <div className="content-container py-16">
      <div className="mx-auto max-w-xl rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Clerk is not configured
        </h1>
        <p className="mt-3 text-sm leading-relaxed">
          Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to
          .env.local, then restart the dev server.
        </p>
      </div>
    </div>
  );
}
