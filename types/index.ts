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
  parent?: string
}

type Photo = {
  id: string
  path: string
}

type ProductRating = {
  count: number
  rating: number
}

enum DeliveryMethodEnum {
  SFEXPRESS = "SFEXPRESS",
  SELF_PICK_UP = "SELF_PICK_UP"
}

type Shop = {
  address: string,
  deliveryMethods: DeliveryMethodEnum[],
  feedCover: string,
  logo: string,
  name: string,
  phoneNumber: string

}

type Product = {
  name: string,
  category: { name: string, status: "ACTIVE" | "INACTIVE" }
  shop: Shop,
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

type Choice = {
  _id: string,
  name: string,
  photo: string,
  productOption: string,
  subchoices: Choice[]
}

type Option = {
  _id: string,
  fieldName: string,
  priority: number,
  remark: string,
  choices: Choice[]
}
