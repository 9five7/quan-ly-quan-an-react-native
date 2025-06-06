
import {
  Home,
  LayoutDashboard,
  LineChart,
  LogInIcon,
  Package2,
  Salad,
  ShoppingCart,
  Table,
  Users2,
} from "lucide-react-native";

export const sharedMenuItems = [
  {
    title: "Trang chủ",
    Icon: Home,
    href: "Home",

  },

  {
    title: "Quản lý",
    Icon: LineChart,
    href: "Dashboard",
    authRequired: true,
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "Orders",
    authRequired: true,
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: "Tables",
    authRequired: true,
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "Dishes",
    authRequired: true,
  },
  
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "Accounts",
    authRequired: true,
  },
];
export const menuItems = [
  {
    title: 'Trang chủ',
    Icon: Home,
    href: 'Home'
  },
  
  {
    title: 'Đăng nhập',
    Icon: LogInIcon,
    href: 'Login',
    authRequired: false,
  },
  {
    title: 'Quản lý',
    Icon: LayoutDashboard,
    href: 'Dashboard',
    authRequired: true,
  }
]