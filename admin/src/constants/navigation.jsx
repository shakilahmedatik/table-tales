import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  ShoppingBagIcon,
  UsersIcon,
} from 'lucide-react'

export const NAV_LINKS = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <HomeIcon className="size-5" />,
  },
  {
    name: 'Products',
    path: '/products',
    icon: <ShoppingBagIcon className="size-5" />,
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: <ClipboardListIcon className="size-5" />,
  },
  {
    name: 'Customers',
    path: '/customers',
    icon: <UsersIcon className="size-5" />,
  },
]
