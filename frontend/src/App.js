import React from "react";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="container mx-auto p-4">
        <LoginForm />
      </main>
    </div>
  );
}

export default App;
