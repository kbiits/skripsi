import getUsers from "../../actions/getUsers";
import Sidebar from "../../components/sidebar/Sidebar";
import UserList from "./components/UserList";
import getCurrentUser from "../../actions/getCurrentUser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "People - Chat app",
};

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <Sidebar>
      <div className=" h-full">
        <UserList users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
