import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowRightLeft,
    PlusCircle,
    PieChart,
    LogOut,
    Settings,
    User,
    Wallet
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
    const navigate = useNavigate();

    // Use the prop passed from App.js via MainLayout
    const handleLogoutClick = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/history', label: 'Transactions', icon: <ArrowRightLeft size={20} /> },
        { path: '/add-transaction', label: 'Add New', icon: <PlusCircle size={20} /> },
        { path: '/statistics', label: 'Analytics', icon: <PieChart size={20} /> },
    ];

    return (
        <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col h-screen fixed left-0 top-0 border-r border-zinc-900">
            {/* Logo */}
            <div className="p-6 border-b border-zinc-900">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Wallet size={18} className="text-white" />
                    </div>
                    <span className="text-white">FinanceTracker</span>
                </h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Main Menu
                </div>
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'bg-zinc-900 text-white shadow-lg shadow-blue-500/5 border-l-2 border-blue-500'
                                        : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200'}
                                `}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="px-4 mt-8 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Account
                </div>
                <ul className="space-y-1">
                    <li>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
                            <User size={20} />
                            <span className="font-medium">Profile</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
                            <Settings size={20} />
                            <span className="font-medium">Settings</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-950/20 hover:text-red-400 transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Log Out</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* User Profile Mini */}
            <div className="p-4 border-t border-zinc-900">
                <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        P
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-200">Pasha</p>
                        <p className="text-xs text-zinc-500">Premium Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
