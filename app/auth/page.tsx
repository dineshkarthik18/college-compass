import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <section>
        <p className="mb-3 inline-flex rounded bg-skyglass px-3 py-1 text-sm font-semibold text-ink">Student workspace</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-normal sm:text-5xl">Keep your shortlist attached to your account.</h1>
        <p className="mt-4 max-w-xl leading-7 text-ink/68">
          Sign up, save colleges, and return later to continue comparing options. Demo login: demo@student.com / student123.
        </p>
      </section>
      <AuthForm />
    </main>
  );
}
