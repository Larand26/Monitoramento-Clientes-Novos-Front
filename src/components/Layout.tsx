import NavBar from "./NavBar";

export default function Layout(props: {
  children: React.ReactNode;
  showNavBar?: boolean;
  page?: string;
}) {
  return (
    <div className="bg-page min-h-screen">
      {props.showNavBar !== false && <NavBar page={props.page} />}
      {props.children}
    </div>
  );
}
