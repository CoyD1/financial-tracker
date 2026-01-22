import React from 'react';

const Header = () => {
    return (
        <header className="flex justify-between items-center py-5 px-8 bg-zinc-950/50 backdrop-blur-xl text-zinc-100 border-b border-zinc-900 sticky top-0 z-10">
            <div className="flex items-center">
                <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="flex items-center gap-6">
                {/* No icons for now */}
            </div>
        </header>
    );
};

export default Header;
