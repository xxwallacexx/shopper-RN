import { AntDesign } from "@expo/vector-icons"
import { tokens } from "@tamagui/themes"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"
import moment from "moment"
import { useState } from "react"
import { FlatList, RefreshControl, SafeAreaView, SectionList, TouchableOpacity } from "react-native"
import { Spinner, XStack } from "tamagui"
import { AnimatePresence } from "tamagui"
import { SizableText } from "tamagui"
import { Image, Text, YStack } from "tamagui"
import { getSelf, listBookmarks } from "~/api"
import { AnimatedTabs, ProductCard } from "~/components"
import { useAuth, useLocale } from "~/hooks"
import { AnimatedYStack, Badge, Container } from "~/tamagui.config"

const Profile = () => {
  const { t } = useLocale()
  const { token } = useAuth()
  const tabs = [
    { label: t("myBookmarks"), value: "myBookmarks" },
    { label: t("myWallet"), value: "myWallet" },
    { label: t("myOrders"), value: "myOrders" },
  ];


  const { data: user } = useQuery({ queryKey: ['profile', token], queryFn: async () => { return await getSelf(token) } })

  const {
    data: bookmarks,
    isFetching: isBookmarksFetching,
    isFetchingNextPage: isFetchingMoreBookmarks,
    fetchNextPage: fetchMoreBookmarks,
    hasNextPage: bookmarksHasNextPage,
    refetch: refetchBookmarks,
  } = useInfiniteQuery({
    queryKey: ['bookmarks'],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return listBookmarks(token, pageParam)
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null
      if (!lastPage.length) return null
      return pages.flat().length
    },
  })


  const bookmarksData = bookmarks?.pages
    ? bookmarks.pages.flat()
    : []


  console.log(bookmarksData)

  const [selectedTab, setSelectedTab] = useState(tabs[0].value)
  const onRefresh = () => {

  }

  const onEndReached = () => {
    fetchMoreBookmarks()
  }

  const renderBookmarks = ({ item }: { item: Bookmark }) => {
    const { product } = item
    const { _id, price, category, name, introduction, photos } = product
    const uri = photos[0].path
    return (
      <Link href={`/product/${_id}`} asChild >
        <TouchableOpacity style={{ flex: 0.5 }} >
          <ProductCard
            imageUri={uri}
            price={price}
            categoryName={category.name}
            name={name}
            introduction={introduction}
          />
        </TouchableOpacity>
      </Link>

    )

  }

  const renderSectionItem = ({ section }) => {
    switch (section.key) {
      case "main":
        return (
          <YStack minHeight={120}>
            <Text>this is main</Text>
          </YStack>
        )
      case "tabView":
        return (
          <AnimatePresence
            exitBeforeEnter
            enterVariant={"defaultFade"}
            exitVariant={"defaultFade"}
          >
            <AnimatedYStack key={selectedTab} animation="100ms" x={0} opacity={1} flex={1}>
              <FlatList
                data={bookmarksData}
                renderItem={renderBookmarks}
                numColumns={2}
                keyExtractor={(item, index) => item._id}
                style={{ flex: 1 }}
                columnWrapperStyle={{
                  flex: 1,
                  justifyContent: "space-between"
                }}
                ListFooterComponent={() => {
                  if (!isBookmarksFetching && !isFetchingMoreBookmarks) {
                    return null
                  }
                  return (
                    <Spinner color="$color.primary" />
                  )
                }}
                ListEmptyComponent={() => {
                  if (isBookmarksFetching || isFetchingMoreBookmarks) {
                    return null
                  }
                  return (
                    <Container alignItems='center'>
                    </Container>
                  )
                }}
              />
            </AnimatedYStack>
          </AnimatePresence>

        );

      default:
        return <></>
    }
  }

  const renderHeader = ({ section }) => {
    return (
      <Text>header</Text>
    )
  }
  const renderSectionHeader = ({ section }) => {
    switch (section.key) {
      case "tabView":
        return (
          <AnimatedTabs
            tabs={tabs}
            initialTab={tabs[0].value}
            onTabChanged={setSelectedTab}
          />
        );

      default:
        return <></>
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SectionList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
          />
        }
        onEndReached={onEndReached}
        renderItem={renderSectionItem}
        sections={[
          { key: "main", data: [""] },
          { key: "tabView", data: [""] },
        ]}
        ListHeaderComponent={renderHeader}
        renderSectionHeader={renderSectionHeader}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
      />
    </SafeAreaView>

  )
}

export default Profile
