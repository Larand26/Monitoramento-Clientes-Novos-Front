import NavBar from "./NavBar";

export default function Layout(props: {
  children: React.ReactNode;
  showNavBar?: boolean;
  page?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-page min-h-screen">
      {props.showNavBar !== false && <NavBar page={props.page} />}
      <div className="container mx-auto px-4 py-8">
        {props.title && (
          <h1 className="text-3xl text-main font-title">{props.title}</h1>
        )}
        {props.subtitle && (
          <p className="text-muted text-sm">{props.subtitle}</p>
        )}
        {props.children}
      </div>
    </div>
  );
}
