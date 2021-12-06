import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import BusquedaLibros from "views/BusquedaLibros.js";
import Typography from "views/Typography.js";
import TableList from "views/TableList.js";
import InternalBooks from "views/InternalBooks.js";
import Upgrade from "views/Upgrade.js";
import UserPage from "views/UserPage.js";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/BusquedaLibros",
    name: "Buscador de libros",
    icon: "design_image",
    component: BusquedaLibros,
    layout: "/admin",
  },
  {
    path: "/InternalBooks",
    name: "Libros internos",
    icon: "location_map-big",
    component: InternalBooks,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "ui-1_bell-53",
    component: Notifications,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "users_single-02",
    component: UserPage,
    layout: "/admin",
  },
  {
    path: "/extended-tables",
    name: "Table List",
    icon: "files_paper",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "design-2_ruler-pencil",
    component: Typography,
    layout: "/admin",
  },
  {
    pro: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "objects_spaceship",
    component: Upgrade,
    layout: "/admin",
  },
];
export default dashRoutes;
