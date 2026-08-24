import NavBar from "./NavBar";

export default function Layout(props: {
  children: React.ReactNode;
  showNavBar?: boolean;
}) {
  return (
    <div className="bg-page min-h-screen">
      {props.showNavBar !== false && <NavBar />}
      {props.children}
    </div>
  );
}
