import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { InvoicesTable } from "./_components/payment-table/invoice-table";
import { CreatePaymentDialog } from "./_components/payment-table/create-payment-dialog";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {session && (
            <span>
              {session.user?.name}&apos;s{" "}
              <span className="text-[hsl(280,100%,70%)]">Finanzen</span>
            </span>
          )}
        </h1>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <InvoiceTable />

        {session && <CreatePaymentDialog />}
      </div>
    </main>
  );
}

async function InvoiceTable() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const payments = await api.payment.getAll.query();

  return (
    <div className="w-full max-w-6xl">
      <InvoicesTable payments={payments} />
    </div>
  );
}
