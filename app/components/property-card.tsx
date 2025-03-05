import Link from "next/link"
import type { Property } from "@/lib/types"

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { name, url, price, pricePerPerson, rooms, features, votes } = property

  const slug = url.replace(/\s+/g, "-").toLowerCase()

  return (
    <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg transition-transform hover:translate-y-[-5px] h-full flex flex-col">
      <div className="bg-primary text-primary-foreground p-4 relative">
        <h2 className="text-xl font-bold">{name}</h2>
        <div className="absolute right-4 top-4 bg-accent text-accent-foreground py-1 px-3 rounded-full font-bold">
          €{price}
        </div>
      </div>

      <div className="p-4 flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {features.piscinaExterior && (
            <div className="bg-secondary text-secondary-foreground rounded-full py-1 px-3 text-sm flex items-center gap-1">
              <span>🏊</span> Piscina Exterior
            </div>
          )}

          {features.piscinaInterior && (
            <div className="bg-secondary text-secondary-foreground rounded-full py-1 px-3 text-sm flex items-center gap-1">
              <span>🏊‍♂️</span> Piscina Interior
            </div>
          )}

          {features.salaoJogos && (
            <div className="bg-secondary text-secondary-foreground rounded-full py-1 px-3 text-sm flex items-center gap-1">
              <span>🎮</span> Salão de Jogos
            </div>
          )}

          {rooms > 0 && (
            <div className="bg-secondary text-secondary-foreground rounded-full py-1 px-3 text-sm flex items-center gap-1">
              <span>🛏️</span> {rooms} Quartos
            </div>
          )}
        </div>

        <div className="flex items-center mb-3">
          <span className="mr-2 text-primary w-6 text-center text-lg">💰</span>
          <span>
            Preço por pessoa: <span className="font-bold text-primary">€{pricePerPerson.toFixed(2)}</span>
          </span>
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-primary w-6 text-center text-lg">🔗</span>
          <Link href={`/property/${slug}`} className="text-primary hover:underline font-medium">
            Ver detalhes
          </Link>
        </div>
      </div>

      {(votes.renato || votes.carlos || votes.cristovao) && (
        <div className="flex flex-wrap justify-between bg-muted p-3 border-t border-border gap-2">
          {votes.renato && (
            <div className="bg-secondary text-secondary-foreground rounded-full py-1 px-3 flex items-center">
              <span className="text-accent mr-1">👍</span> Renato: {votes.renato}
            </div>
          )}

          {votes.carlos && (
            <div className="bg-secondary text-secondary-foreground rounded-full py-1 px-3 flex items-center">
              <span className="text-accent mr-1">👍</span> Carlos: {votes.carlos}
            </div>
          )}

          {votes.cristovao && (
            <div className="bg-secondary text-secondary-foreground rounded-full py-1 px-3 flex items-center">
              <span className="text-accent mr-1">👍</span> Cristóvão: {votes.cristovao}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

