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
  name: string,
  priority: number,
  shop: string,
  status: "ACTIVE" | "INACTIVE"
  createdAt: Date
  updatedAt: Date
  children: Category[]
}
