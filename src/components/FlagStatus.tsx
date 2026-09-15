export default function FlagStatus(props: {
  status: "IN_CRM" | "LOST" | "SUCCESS" | "FREEZE";
  className?: string;
}) {
  const baseWrapperStyle =
    "px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap uppercase flex items-center justify-center transition-all duration-300";

  const getStatusTheme = () => {
    switch (props.status) {
      case "IN_CRM":
        return "bg-primary/10 text-primary";
      case "LOST":
        return "bg-error/10 text-error";
      case "SUCCESS":
        return "bg-success/10 text-success";
      case "FREEZE":
        return "bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]";
      default:
        return "bg-muted/10 text-muted";
    }
  };

  return (
    <div
      className={`${baseWrapperStyle} ${getStatusTheme()} ${
        props.className || ""
      }`}
    >
      {props.status === "IN_CRM" && <span>no CRM</span>}
      {props.status === "LOST" && <span>perdido</span>}
      {props.status === "SUCCESS" && <span>sucesso</span>}
      {props.status === "FREEZE" && (
        <span className="flex items-center gap-1 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]">
          <span>❄️</span> esfriando
        </span>
      )}
    </div>
  );
}
