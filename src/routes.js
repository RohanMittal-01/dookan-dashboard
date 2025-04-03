// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Profile from "views/Dashboard/Profile";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Products from "views/Dashboard/Tables/components/Products";
import EventLogs from "views/Dashboard/Tables/components/EventLogs";

import {
  HomeIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  CartIcon,
  ActivityIcon,
} from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/products",
    name: "Products",
    rtlName: "المنتجات",
    icon: <CartIcon color="inherit" />,
    component: Products,
    layout: "/admin",
  },
  {
    path: "/events",
    name: "Event Logs",
    rtlName: "سجلات الأحداث",
    icon: <ActivityIcon color="inherit" />,
    component: EventLogs,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "ملف تعريفي",
    icon: <PersonIcon color="inherit" />,
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/signin",
    name: "Sign In",
    rtlName: "تسجيل الدخول",
    icon: <DocumentIcon color="inherit" />,
    component: SignIn,
    noCollapse: true,
    layout: "/auth",
  },
  {
    path: "/signup",
    name: "Sign Up",
    rtlName: "اشتراك",
    icon: <RocketIcon color="inherit" />,
    component: SignUp,
    noCollapse: true,
    layout: "/auth",
  },
];

export default dashRoutes;
