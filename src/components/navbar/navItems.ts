import { FaUserAlt } from "react-icons/fa";
import { MdPayments, MdSpaceDashboard, MdAccessTimeFilled, MdAssignment } from "react-icons/md";

const navItems = [
    { href: "/dashboard", icon: MdSpaceDashboard, label: "Dashboard" },
    { href: "/employee", icon: FaUserAlt, label: "Clearance" },
    { href: "/attendance", icon: MdAssignment, label: "Settings" },
    { href: "/payroll", icon: MdPayments, label: "Account" },
    { href: "/history", icon: MdAccessTimeFilled, label: "History" },
];

export default navItems;