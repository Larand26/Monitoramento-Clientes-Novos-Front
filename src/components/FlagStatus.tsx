export default function FlagStatus(props: {
  status: "IN_CRM" | "LOST" | "SUCCESS";
  className?: string;
}) {
  const styleText = "px-2 py-1 rounded-full text-xs font-semibold";
  return (
    <div
      className={`bg-success/10 text-center ${styleText} ${props.className}`}
    >
      <p>
        {props.status === "IN_CRM" && (
          <span className={`${styleText} text-primary `}>no CRM</span>
        )}
        {props.status === "LOST" && (
          <span className={`${styleText} text-error `}>perdido</span>
        )}
        {props.status === "SUCCESS" && (
          <span className={`${styleText} text-success `}>sucesso</span>
        )}
      </p>
    </div>
  );
}
