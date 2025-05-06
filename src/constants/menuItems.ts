import {
  Home,
  LineChart,
  Package2,
  Salad,
  ShoppingCart,
  Table,
  Users2,
} from "lucide-react-native";

export const sharedMenuItems = [
  {
    title: "Trang chủ",
    Icon: Package2,
    href: "Home",
    authRequired: undefined,
  },

  {
    title: "Dashboard",
    Icon: Home,
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
    title: "Phân tích",
    Icon: LineChart,
    href: "Analytics",
    authRequired: true,
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "Accounts",
    authRequired: true,
  },
];
