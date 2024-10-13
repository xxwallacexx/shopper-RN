import { useQuery } from "@tanstack/react-query"
import { H2, Theme } from "tamagui"
import { listCartItems } from "~/api"
import { useAuth, useLocale } from "~/hooks"

const Carts = () => {
  const { t } = useLocale()
  const { token } = useAuth()

  if (!token) return <></>

  const {
    data: cartItems
  } = useQuery({
    queryKey: [`cartItems`],
    queryFn: async () => {
      return await listCartItems(token)
    }
  })

  console.log(cartItems)



  return (
    <Theme name="light">
      <H2>Cart</H2>
    </Theme>
  )
}

export default Carts
