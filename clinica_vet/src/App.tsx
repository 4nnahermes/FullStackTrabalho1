import { Outlet } from "react-router";
import Menu from "./components/Menu";

export default function App() {
  return (
    <>
      <Menu />

      <main className="w3-margin-top">
        <Outlet />
      </main>
    </>
  );
}