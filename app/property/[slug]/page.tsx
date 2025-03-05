'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { properties } from "@/lib/data"
import { notFound } from "next/navigation"
import type { Property } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"

export default function PropertyDetail({ params }: { params: { slug: string } }) {
  const initialProperty = properties.find((p) => p.url.replace(/\s+/g, "-").toLowerCase() === params.slug)

  if (!initialProperty) {
    notFound()
  }

  const [property, setProperty] = useState<Property>(initialProperty)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (property.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if (property.pricePerPerson <= 0) {
      newErrors.pricePerPerson = "Price per person must be greater than 0"
    }
    if (property.rooms < 0) {
      newErrors.rooms = "Rooms cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProperty((prev) => ({
      ...prev,
      [name]: name === "price" || name === "pricePerPerson" || name === "rooms" ? Number(value) : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setProperty((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: checked,
      },
    }))
  }

  const handleVotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProperty((prev) => ({
      ...prev,
      votes: {
        ...prev.votes,
        [name]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors before saving")
      return
    }

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      toast.success("Changes saved successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] w-full overflow-hidden"
      >
        <Image
          src={getPropertyImage(property.name)}
          alt={property.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-x-0 bottom-0 container py-8"
        >
          <Link 
            href="/" 
            className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors"
          >
            <motion.span
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >←</motion.span> 
            Back to properties
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">{property.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-2">
              <span className="text-accent">€</span>
              {property.price} total
            </span>
            <span className="text-white/60">•</span>
            <span className="flex items-center gap-2">
              <span className="text-accent">€</span>
              {property.pricePerPerson} per person
            </span>
            {property.rooms > 0 && (
              <>
                <span className="text-white/60">•</span>
                <span>{property.rooms} rooms</span>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      <main className="container py-8">
        <motion.div 
          className="flex justify-end mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.button
                key="edit"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="button button-primary"
              >
                Edit Property
              </motion.button>
            ) : (
              <motion.div
                key="save-cancel"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="button bg-muted text-foreground hover:bg-muted/80"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="button button-primary relative"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="card"
                >
                  <h2 className="text-2xl font-semibold mb-6">Features</h2>
                  <div className="grid gap-4">
                    {Object.entries(property.features).map(([key, value]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                      >
                        <span className="text-2xl">{getFeatureEmoji(key)}</span>
                        <span className="flex-1">{formatFeatureName(key)}</span>
                        <span className={`text-sm font-medium ${value ? 'text-success' : 'text-muted-foreground'}`}>
                          {value ? "Yes" : "No"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="card"
                >
                  <h2 className="text-2xl font-semibold mb-6">Votes</h2>
                  <div className="grid gap-4">
                    {Object.entries(property.votes).map(([name, vote], index) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <span className="capitalize font-medium">{name}</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${vote ? 'bg-primary/10 text-primary font-medium' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                          {vote || "No vote"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="card"
                >
                  <h2 className="text-2xl font-semibold mb-6">Edit Features</h2>
                  <div className="form-group">
                    <div className="form-section">
                      <div>
                        <label className="form-label">Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                          <input
                            type="number"
                            name="price"
                            value={property.price}
                            onChange={handleInputChange}
                            className={`input ${errors.price ? 'border-[hsl(var(--error))] focus:ring-[hsl(var(--error))]' : ''}`}
                          />
                        </div>
                        {errors.price && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="error-message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            {errors.price}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Price per Person</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                          <input
                            type="number"
                            name="pricePerPerson"
                            value={property.pricePerPerson}
                            onChange={handleInputChange}
                            className={`input ${errors.pricePerPerson ? 'border-[hsl(var(--error))] focus:ring-[hsl(var(--error))]' : ''}`}
                          />
                        </div>
                        {errors.pricePerPerson && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="error-message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            {errors.pricePerPerson}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Rooms</label>
                        <input
                          type="number"
                          name="rooms"
                          value={property.rooms}
                          onChange={handleInputChange}
                          className={`input ${errors.rooms ? 'border-[hsl(var(--error))] focus:ring-[hsl(var(--error))]' : ''}`}
                        />
                        {errors.rooms && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="error-message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            {errors.rooms}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="form-label">Amenities</label>
                      <div className="space-y-2 bg-muted/50 rounded-lg p-3">
                        {Object.entries(property.features).map(([key, value]) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="checkbox-group"
                          >
                            <input
                              type="checkbox"
                              id={key}
                              name={key}
                              checked={value}
                              onChange={handleFeaturesChange}
                              className="checkbox"
                            />
                            <label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                              <span className="text-xl">{getFeatureEmoji(key)}</span>
                              <span>{formatFeatureName(key)}</span>
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="card"
                >
                  <h2 className="text-2xl font-semibold mb-6">Edit Votes</h2>
                  <div className="form-group">
                    {Object.entries(property.votes).map(([name, vote], index) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="form-section"
                      >
                        <label className="form-label capitalize">{name}&apos;s Vote</label>
                        <input
                          type="text"
                          name={name}
                          value={vote}
                          onChange={handleVotesChange}
                          className="input"
                          placeholder="Enter vote"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
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

  return imageMap[propertyName] || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80"
}

function getFeatureEmoji(feature: string): string {
  const emojiMap: Record<string, string> = {
    piscinaExterior: "🏊",
    piscinaInterior: "🏊‍♂️",
    salaoJogos: "🎮",
  }
  return emojiMap[feature] || "✨"
}

function formatFeatureName(feature: string): string {
  const nameMap: Record<string, string> = {
    piscinaExterior: "Outdoor Pool",
    piscinaInterior: "Indoor Pool",
    salaoJogos: "Game Room",
  }
  return nameMap[feature] || feature
}

