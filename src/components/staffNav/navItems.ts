import { FaUser, FaUserAlt } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdSpaceDashboard} from "react-icons/md";
import { RiFileWarningFill } from "react-icons/ri";

const navItems = [
    { href: "/staff/dashboard", icon: MdSpaceDashboard, label: "Dashboard" },
    { href: "/staff/account", icon: FaUserAlt, label: "Account" },
    { href: "/staff/billings", icon: FaMoneyCheckDollar, label: "Billings" },
    { href: "/staff/technical", icon: RiFileWarningFill, label: "Technical Issues" },
    { href: "/staff/settings", icon: IoMdSettings, label: "Settings" },
];

export default navItems;