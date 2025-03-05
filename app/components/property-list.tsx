"use client"

import type React from "react"

import { useState, useEffect } from "react"
import PropertyCard from "./property-card"
import type { Property } from "@/lib/types"

interface PropertyListProps {
  properties: Property[]
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [sortMethod, setSortMethod] = useState<string>("price-asc")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties)

  useEffect(() => {
    const filtered = properties.filter((property) => {
      const featureFilter =
        activeFilter === "all" ||
        (activeFilter === "piscina-exterior" && property.features.piscinaExterior) ||
        (activeFilter === "piscina-interior" && property.features.piscinaInterior) ||
        (activeFilter === "salao-jogos" && property.features.salaoJogos)

      const priceFilter = property.pricePerPerson >= priceRange[0] && property.pricePerPerson <= priceRange[1]

      return featureFilter && priceFilter
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sortMethod) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "price-per-person-asc":
          return a.pricePerPerson - b.pricePerPerson
        case "price-per-person-desc":
          return b.pricePerPerson - a.pricePerPerson
        default:
          return 0
      }
    })

    setFilteredProperties(sorted)
  }, [properties, activeFilter, sortMethod, priceRange])

  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = Number(event.target.value)
    setPriceRange((prev) => {
      const newRange = [...prev] as [number, number]
      newRange[index] = newValue
      return newRange
    })
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Filtrar por características</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full transition-colors ${activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/20"}`}
            onClick={() => setActiveFilter("all")}
          >
            🏠 Todas
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-colors ${activeFilter === "piscina-exterior" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/20"}`}
            onClick={() => setActiveFilter("piscina-exterior")}
          >
            🏊 Piscina Exterior
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-colors ${activeFilter === "piscina-interior" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/20"}`}
            onClick={() => setActiveFilter("piscina-interior")}
          >
            🏊‍♂️ Piscina Interior
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-colors ${activeFilter === "salao-jogos" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/20"}`}
            onClick={() => setActiveFilter("salao-jogos")}
          >
            🎮 Salão de Jogos
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Filtrar por preço por pessoa</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2">
            <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
              Preço mínimo: €{priceRange[0]}
            </label>
            <input
              type="range"
              id="min-price"
              min="0"
              max="1000"
              step="10"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(e, 0)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
              Preço máximo: €{priceRange[1]}
            </label>
            <input
              type="range"
              id="max-price"
              min="0"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(e, 1)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ordenar por</h2>
        <select
          className="w-full md:w-auto px-4 py-2 rounded-md border border-input bg-background text-foreground"
          value={sortMethod}
          onChange={(e) => setSortMethod(e.target.value)}
        >
          <option value="price-asc">Preço (Menor para Maior)</option>
          <option value="price-desc">Preço (Maior para Menor)</option>
          <option value="price-per-person-asc">Preço por Pessoa (Menor para Maior)</option>
          <option value="price-per-person-desc">Preço por Pessoa (Maior para Menor)</option>
        </select>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center p-10 bg-card text-card-foreground rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Nenhuma propriedade encontrada</h3>
          <p>Tente outros critérios de filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.url} property={property} />
          ))}
        </div>
      )}
    </>
  )
}

