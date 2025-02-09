"use client";

import Avatar from "@/app/components/Avatar";
import { useAuthStore } from "@/app/context/AuthContext";
import { conversation } from "@/app/hooks/useConversation";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";

interface HeaderProps {
  conversation: conversation;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const user = useAuthStore((state) => state.user);
  const otherUser = conversation.members.find(
    (member) => member.user_id !== user.id
  );

  return (
    <>
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            className="lg:hidden block text-cyan-500 hover:text-cyan-600 transition cursor-pointer"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>

          <Avatar user={otherUser} />
          {otherUser?.user.fullname}
        </div>
      </div>
    </>
  );
};
export default Header;
