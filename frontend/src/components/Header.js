import React from "react";

const Header = ({onLogout}) => {
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Финансовый Трекер</h1>
      </div>
        <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
          >
            Выйти
          </button>
    </header>
  );
};

export default Header;
