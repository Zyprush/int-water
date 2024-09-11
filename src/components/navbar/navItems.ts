import { FaUser, FaUserAlt } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdSpaceDashboard} from "react-icons/md";
import { RiFileWarningFill } from "react-icons/ri";

const navItems = [
    { href: "/admin/dashboard", icon: MdSpaceDashboard, label: "Dashboard" },
    { href: "/admin/account", icon: FaUserAlt, label: "Account" },
    { href: "/admin/billings", icon: FaMoneyCheckDollar, label: "Billings" },
    { href: "/admin/technical", icon: RiFileWarningFill, label: "Technical Issues" },
    { href: "/admin/staff-list", icon: FaUser, label: "Staff List" },
    { href: "/admin/settings", icon: IoMdSettings, label: "Settings" },
];

export default navItems;