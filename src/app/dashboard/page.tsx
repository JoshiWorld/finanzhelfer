import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import DashboardPage from "~/app/_components/dashboard";

export default async function Dashboard() {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect('/');
  }

  return <DashboardPage />;
}
