import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, onLogout }) => {
    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
            {/* Fixed Sidebar */}
            <Sidebar onLogout={onLogout} />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
