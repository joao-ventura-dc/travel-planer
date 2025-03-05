export interface Property {
  name: string
  url: string
  price: number
  pricePerPerson: number
  rooms: number
  features: {
    salaoJogos: boolean
    piscinaExterior: boolean
    piscinaInterior: boolean
  }
  votes: {
    renato: string
    carlos: string
    cristovao: string
  }
}

