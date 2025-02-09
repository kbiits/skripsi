import { signOut } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';

const useRoutes = () => {
  const pathname = usePathname();

  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }

    return params?.conversationId as string;
  }, [params?.conversationId]);

  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: HiChat,
        active: pathname === '/conversations' || !!conversationId,
      },
      {
        label: 'Users',
        href: '/users',
        icon: HiUsers,
        active: pathname === '/users',
      },
      {
        label: 'Logout',
        href: '#',
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
