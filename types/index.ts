export type Banner = {
  photo: string
  shop: string
  detail: string
  name: string
  sort: number
  status: "ACTIVE" | "INACTIVE"
  createdAt: Date
  updatedAt: Date
}

export type Category = {
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

export type Photo = {
  id: string
  path: string
}

export type ProductRating = {
  count: number
  rating: number
}

export enum DeliveryMethodEnum {
  SFEXPRESS = "SFEXPRESS",
  SELF_PICK_UP = "SELF_PICK_UP"
}


export type Coupon = {
  _id: string,
  credit: number,
  detail: string,
  discount: number,
  endDate: Date,
  name: string,
  photo: string,
  terms: string
  minPriceRequired: number,
  maxPurchase: number
}

export type Shop = {
  address: string
  deliveryMethods: DeliveryMethodEnum[]
  feedCover: string
  logo: string
  name: string
  stores: string[]
  phoneNumber: string
  searchCover: string
  couponCover: string
  terms: string
}

export type Product = {
  _id: string,
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

export type Choice = {
  _id: string,
  name: string,
  photo: string,
  productOption: string,
  subchoices: Choice[]
}

export type Option = {
  _id: string,
  fieldName: string,
  priority: number,
  remark: string,
  choices: Choice[]
}


export type OrderContent = {
  choices: string[],
  quantity: number
}

export type Address = {
  room?: string,
  street?: string,
  district?: string,
  phoneNumber?: string
}

export type User = {
  _id: string,
  avatar: string,
  address: Address,
  email: string,
  isTemp: boolean,
  username: string
}

export type Bookmark = {
  _id: string,
  product: Product,
  shop: Shop
}

export type Auth = {
  token: string,
  tokenExpAt: string
}
