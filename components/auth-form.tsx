"use client";

import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@student.com");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mode === "signup" ? { name, email, password } : { email, password })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to continue");
      return;
    }

    window.location.href = "/saved";
  }

  return (
    <section className="rounded border border-line bg-white p-5 shadow-soft">
      <div className="grid grid-cols-2 rounded bg-paper p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`focus-ring inline-flex h-10 items-center justify-center gap-2 rounded text-sm font-semibold ${mode === "login" ? "bg-white shadow-sm" : "text-ink/60"}`}
        >
          <LogIn size={16} />
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`focus-ring inline-flex h-10 items-center justify-center gap-2 rounded text-sm font-semibold ${mode === "signup" ? "bg-white shadow-sm" : "text-ink/60"}`}
        >
          <UserPlus size={16} />
          Signup
        </button>
      </div>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        {mode === "signup" && (
          <label className="grid gap-1.5 text-sm font-semibold">
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} className="focus-ring h-11 rounded border border-line bg-paper px-3 font-normal" required />
          </label>
        )}
        <label className="grid gap-1.5 text-sm font-semibold">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="focus-ring h-11 rounded border border-line bg-paper px-3 font-normal" required />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="focus-ring h-11 rounded border border-line bg-paper px-3 font-normal" required />
        </label>
        {error && <p className="rounded bg-coral/10 p-3 text-sm font-semibold text-coral">{error}</p>}
        <button disabled={loading} className="focus-ring inline-flex h-11 items-center justify-center rounded bg-ink px-4 text-sm font-semibold text-white hover:bg-moss disabled:opacity-60">
          {loading ? "Working..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </section>
  );
}
