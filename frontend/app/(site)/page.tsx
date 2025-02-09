import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import getCurrentUser from "../actions/getCurrentUser";

export default async function Home() {
  const session = await getCurrentUser();
  if (session) {
    redirect("/users");
  } else {
    redirect("/login");
  }
}
