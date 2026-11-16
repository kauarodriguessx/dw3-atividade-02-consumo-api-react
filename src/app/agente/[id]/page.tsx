import Link from "next/link";

interface Habilidade {
  slot: string;
  displayName: string;
  description: string;
  displayIcon?: string;
}

interface DetalhesAgente {
  uuid: string;
  displayName: string;
  description: string;
  fullPortrait: string;
  role?: {
    displayName: string;
    description: string;
  };
  abilities: Habilidade[];
}

function limparTags(texto?: string) {
  if (!texto) return "";
  return texto.replace(/<[^>]*>/g, "");
}

function traduzirSlot(slot: string) {
  const mapaSlots: Record<string, string> = {
    Ability1: "Habilidade 1 (Q)",
    Ability2: "Habilidade 2 (E)",
    Grenade: "Habilidade 3 (C)",
    Ultimate: "Ultimate (X)",
  };

  return mapaSlots[slot] || slot;
}

async function buscarAgentePorId(id: string): Promise<DetalhesAgente> {
  const res = await fetch(
    `https://valorant-api.com/v1/agents/${id}?language=pt-BR`
  );

  if (!res.ok) {
    throw new Error("Agente não encontrado");
  }

  const json = await res.json();
  return json.data;
}

export default async function PaginaDetalhesAgente({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agente = await buscarAgentePorId(id);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-red-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg mb-8 transition-colors"
        >
          ← Voltar ao catálogo
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center bg-zinc-950/60 rounded-xl p-4 border border-zinc-800/80">
            <img
              src={agente.fullPortrait}
              alt={agente.displayName}
              className="max-h-[450px] object-contain"
            />
          </div>

          <div>
            <span className="inline-block bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {agente.role?.displayName}
            </span>

            <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-4">
              {agente.displayName}
            </h1>

            <p className="text-zinc-300 leading-relaxed mb-6">
              {limparTags(agente.description)}
            </p>

            {agente.role?.description && (
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6">
                <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">
                  Função: {agente.role.displayName}
                </h3>
                <p className="text-sm text-zinc-400">
                  {limparTags(agente.role.description)}
                </p>
              </div>
            )}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-red-500 mb-6">
            Habilidades
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agente.abilities
              .filter((habilidade) => habilidade.slot !== "Passive")
              .map((habilidade) => (
                <div
                  key={habilidade.slot}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex gap-4 items-start"
                >
                  {habilidade.displayIcon && (
                    <img
                      src={habilidade.displayIcon}
                      alt={habilidade.displayName}
                      className="w-12 h-12 bg-zinc-800 p-2 rounded-lg shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-xs uppercase font-bold text-red-400">
                      {traduzirSlot(habilidade.slot)}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {habilidade.displayName}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {limparTags(habilidade.description)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}