import getConversations from "@/app/actions/getConversations";
import Sidebar from "../../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
    <>
      <Sidebar>
        <div className="h-full w-full flex flex-row">
          <div className="h-full">
            <ConversationList conversations={conversations} />
          </div>
          {children}
        </div>
      </Sidebar>
    </>
  );
}
