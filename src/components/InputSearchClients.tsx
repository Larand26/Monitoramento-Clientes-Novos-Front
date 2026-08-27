import { useState, useRef, useEffect } from "react";
import * as utils from "../utils/utils";
import type { Client } from "../interfaces/client.interface";

export default function InputSearchClients(props: {
  data: Client[];
  searchQuery: string;
  onchange: (query: string) => void;
  onSearch?: () => void;
  onGetHistory: (client: Client) => void; // Recebe o cliente completo
  isClientSelected?: boolean; // Nova prop
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o menu automaticamente quando um cliente é selecionado
  useEffect(() => {
    if (props.isClientSelected) {
      setOpen(false);
    }
  }, [props.isClientSelected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      // Transição dinâmica de posição, largura e alinhamento
      className={`absolute transition-all duration-700 ease-in-out flex flex-col z-50 ${
        props.isClientSelected
          ? "w-[300px] top-0 right-0 translate-y-0 translate-x-0"
          : `w-full max-w-3xl left-1/2 -translate-x-1/2 ${
              open ? "top-0 translate-y-0 mt-4" : "top-1/2 -translate-y-1/2"
            }`
      }`}
    >
      <h1
        className={`text-center font-title text-main transition-all duration-500 ease-in-out overflow-hidden ${
          open || props.isClientSelected // Desaparece também se houver cliente selecionado
            ? "opacity-0 max-h-0 mb-0 scale-95"
            : "opacity-100 max-h-20 mb-6 scale-100 text-4xl"
        }`}
      >
        PESQUISE O CLIENTE DESEJADO
      </h1>
      <div
        className={`w-full overflow-hidden flex flex-col ${
          open
            ? "bg-card rounded-2xl shadow-2xl h-[calc(100vh-250px)] min-h-[400px] max-h-[800px] border border-muted/20"
            : "bg-transparent rounded-full h-[52px] border border-transparent"
        }`}
        style={{
          transition: `
            height 500ms ease-in-out, 
            background-color 500ms ease-in-out, 
            border-color 500ms ease-in-out, 
            box-shadow 500ms ease-in-out, 
            border-radius 0ms linear ${open ? "0ms" : "500ms"}
          `,
        }}
      >
        <div
          className={`relative flex items-center w-full transition-colors duration-500 ${
            open ? "p-4" : "p-0"
          }`}
        >
          <div
            className={`relative flex items-center w-full transition-colors duration-500 ${
              open ? "border border-muted rounded-full" : ""
            }`}
          >
            <input
              type="text"
              placeholder={open ? "Digite o nome do cliente..." : ""}
              className={`w-full text-main outline-none transition-colors duration-500 px-6 py-3 ${
                open ? "bg-transparent rounded-full" : "bg-card rounded-full"
              }`}
              onClick={() => setOpen(true)}
              value={props.searchQuery}
              onChange={(e) => props.onchange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && props.onSearch) {
                  props.onSearch();
                }
              }}
            />

            <button
              className={`absolute right-2 rounded-full p-2 flex items-center justify-center transition-colors duration-300 ${
                open
                  ? "text-muted hover:bg-muted/20"
                  : "bg-page text-main hover:bg-page/80"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (props.onSearch) {
                  props.onSearch();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`flex flex-col w-full px-8 transition-all duration-500 overflow-hidden ${
            open ? "opacity-100 flex-1 pb-6" : "opacity-0 h-0 pb-0"
          }`}
        >
          <p className="text-muted text-sm mb-4 shrink-0">Pesquisas recentes</p>
          <ul className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {props.data.map((client, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    props.onGetHistory(client); // Passa o cliente completo
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted/10 transition-colors duration-300 font-title text-main text-lg cursor-pointer"
                >
                  {client.store_id || "000000"} |{" "}
                  {utils.removeFirstsNubersFromName(client.name)} |{" "}
                  {utils.formatCNPJ(client.cnpj)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
