import Link from "next/link";

interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  role?: {
    displayName: string;
  };
}

async function getAgents(): Promise<Agent[]> {
  const res = await fetch(
    "https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=pt-BR"
  );

  if (!res.ok) {
    throw new Error("Falha ao carregar os agentes");
  }

  const json = await res.json();
  return json.data;
}

export default async function HomePage() {
  const agents = await getAgents();

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-red-500 uppercase">
            Catálogo de Agentes — Valorant
          </h1>
          <p className="text-zinc-400 mt-2">
            Clique em um agente para visualizar suas informações e habilidades
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <Link
              key={agent.uuid}
              href={`/agente/${agent.uuid}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-500 transition-all duration-200 flex flex-col items-center p-5 shadow-lg"
            >
              <div className="w-32 h-32 rounded-full bg-zinc-800 overflow-hidden mb-4 border-2 border-zinc-700 group-hover:border-red-500 transition-colors">
                <img
                  src={agent.displayIcon}
                  alt={agent.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">
                {agent.role?.displayName || "Agente"}
              </span>

              <h2 className="text-xl font-bold text-zinc-100 group-hover:text-red-400 transition-colors">
                {agent.displayName}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}