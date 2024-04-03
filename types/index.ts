type Banner = {
  photo: string
  shop: string
  detail: string
  name: string
  sort: number
  status: "ACTIVE" | "INACTIVE"
  createdAt: Date
  updatedAt: Date
}

type Category = {
  _id: string
  name: string
  priority: number
  shop: string
  status: "ACTIVE" | "INACTIVE"
  createdAt: Date
  updatedAt: Date
  children: Category[]
}

type Photo = {
  id: string
  path: string
}

type ProductRating = {
  count: number
  rating: number
}
type Product = {
  category: { name: string, status: "ACTIVE" | "INACTIVE" }
  cost: number
  description: string
  group: string,
  introduction: string
  isRecommended: boolean
  logisticDescription: string
  options: string[]
  photos: Photo[]
  price: number
  priority: number
  productRating: ProductRating
  stock: number
  productType: "ORDER" | "RESERVATION"
  createdAt: Date
  updatedAt: Date
}
