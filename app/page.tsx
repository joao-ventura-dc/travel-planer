'use client'

import { useState } from "react"
import { properties } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type Filters = {
  priceRange: [number, number]
  minRooms: number
  amenities: {
    piscinaExterior: boolean
    piscinaInterior: boolean
    salaoJogos: boolean
  }
  hasVotes: boolean | null // null means "any", true means "has votes", false means "no votes"
  sortBy: "price" | "pricePerPerson" | "rooms" | "votes"
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, Math.max(...properties.map(p => p.price))],
    minRooms: 0,
    amenities: {
      piscinaExterior: false,
      piscinaInterior: false,
      salaoJogos: false
    },
    hasVotes: null,
    sortBy: "price"
  })

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const filteredProperties = properties
    .filter(property => 
      property.price >= filters.priceRange[0] &&
      property.price <= filters.priceRange[1] &&
      property.rooms >= filters.minRooms &&
      (filters.amenities.piscinaExterior ? property.features.piscinaExterior : true) &&
      (filters.amenities.piscinaInterior ? property.features.piscinaInterior : true) &&
      (filters.amenities.salaoJogos ? property.features.salaoJogos : true) &&
      (filters.hasVotes === null ? true : 
        filters.hasVotes === true ? 
          Object.values(property.votes).some(vote => vote !== "") :
          Object.values(property.votes).every(vote => vote === "")
      )
    )
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.price - b.price
        case "pricePerPerson":
          return a.pricePerPerson - b.pricePerPerson
        case "rooms":
          return b.rooms - a.rooms
        case "votes":
          return (
            Object.values(b.votes).filter(v => v !== "").length -
            Object.values(a.votes).filter(v => v !== "").length
          )
        default:
          return 0
      }
    })

  const maxPrice = Math.max(...properties.map(p => p.price))
  const maxRooms = Math.max(...properties.map(p => p.rooms))

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Find Your Perfect Getaway</h1>
              <p className="text-muted-foreground text-lg mt-2">
                Compare and vote on properties for your next group trip.
              </p>
            </div>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="button button-secondary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters {filteredProperties.length !== properties.length && `(${filteredProperties.length})`}
            </button>
          </div>

          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border rounded-lg p-6 mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={0}
                        max={maxPrice}
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], Number(e.target.value)]
                        }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>€0</span>
                        <span>Up to €{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Rooms Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Rooms</label>
                    <select
                      value={filters.minRooms}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        minRooms: Number(e.target.value)
                      }))}
                      className="input"
                    >
                      <option value={0}>Any</option>
                      {Array.from({ length: maxRooms }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}+ rooms</option>
                      ))}
                    </select>
                  </div>

                  {/* Amenities Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amenities</label>
                    <div className="space-y-2">
                      {Object.entries(filters.amenities).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              amenities: {
                                ...prev.amenities,
                                [key]: e.target.checked
                              }
                            }))}
                            className="checkbox"
                          />
                          <span className="text-sm">{formatFeatureName(key)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort and Vote Filter */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          sortBy: e.target.value as Filters["sortBy"]
                        }))}
                        className="input"
                      >
                        <option value="price">Total Price</option>
                        <option value="pricePerPerson">Price per Person</option>
                        <option value="rooms">Number of Rooms</option>
                        <option value="votes">Most Votes</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vote Status</label>
                      <select
                        value={filters.hasVotes === null ? "any" : filters.hasVotes.toString()}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          hasVotes: e.target.value === "any" ? null : e.target.value === "true"
                        }))}
                        className="input"
                      >
                        <option value="any">Any</option>
                        <option value="true">Has Votes</option>
                        <option value="false">No Votes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Link
              key={property.url}
              href={`/property/${property.url.replace(/\s+/g, "-").toLowerCase()}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <Image
                  src={getPropertyImage(property.name)}
                  alt={property.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">€{property.pricePerPerson}/person</span>
                    {property.rooms > 0 && (
                      <span className="text-sm">• {property.rooms} rooms</span>
                    )}
                  </div>
                  {hasFeatures(property) && (
                    <div className="flex gap-1">
                      {property.features.piscinaExterior && (
                        <span title="Outdoor Pool" className="text-lg">🏊</span>
                      )}
                      {property.features.piscinaInterior && (
                        <span title="Indoor Pool" className="text-lg">🏊‍♂️</span>
                      )}
                      {property.features.salaoJogos && (
                        <span title="Game Room" className="text-lg">🎮</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {hasVotes(property) && (
                <div className="absolute top-4 right-4 group/votes">
                  <div className="bg-accent/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {getVoteCount(property)} votes
                  </div>
                  
                  {/* Votes Tooltip */}
                  <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover/votes:opacity-100 group-hover/votes:visible transition-all duration-200 z-10">
                    <div className="p-3 space-y-2">
                      <h3 className="text-sm font-medium border-b pb-2">Votes for this property</h3>
                      <div className="space-y-1.5">
                        {Object.entries(property.votes).map(([name, vote]) => (
                          vote && (
                            <div key={name} className="flex items-center justify-between text-sm">
                              <span className="capitalize text-muted-foreground">{name}</span>
                              <span className="font-medium">{vote}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function hasFeatures(property: typeof properties[0]): boolean {
  return property.features.piscinaExterior || 
         property.features.piscinaInterior || 
         property.features.salaoJogos
}

function hasVotes(property: typeof properties[0]): boolean {
  return Object.values(property.votes).some(vote => vote !== "")
}

function getVoteCount(property: typeof properties[0]): number {
  return Object.values(property.votes).filter(vote => vote !== "").length
}

function formatFeatureName(feature: string): string {
  const nameMap: Record<string, string> = {
    piscinaExterior: "Outdoor Pool",
    piscinaInterior: "Indoor Pool",
    salaoJogos: "Game Room",
  }
  return nameMap[feature] || feature
}

function getPropertyImage(propertyName: string): string {
  // Map of property names to high-quality Unsplash images
  const imageMap: Record<string, string> = {
    "Quinta das Regadas": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    "Casa da Abuela": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
    "Quinta do Raposinho": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    "Celorico Cottage": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80",
    "Casa do Cão Praia": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80",
    "Cabanas": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80",
    "Douro Natura": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
    "Casa de Plácios": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&q=80",
    "Quinta da Moagem": "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80",
    "Uma Aldeia?": "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&q=80",
    "Casa Paz": "https://images.unsplash.com/photo-1464288550599-43d5a73451b8?auto=format&fit=crop&q=80",
    "Quinta São Roque": "https://images.unsplash.com/photo-1504615755583-2916b52192a3?auto=format&fit=crop&q=80",
    "Casa Rectoral": "https://images.unsplash.com/photo-1506126279646-a697353d3166?auto=format&fit=crop&q=80",
    "Casa Assade": "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80",
    "Casa da Fonte": "https://images.unsplash.com/photo-1462530260150-162092dbf011?auto=format&fit=crop&q=80",
    "Casas da Azenha": "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80",
  }

  // Return the mapped image URL or a default image if not found
  return imageMap[propertyName] || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80"
}
