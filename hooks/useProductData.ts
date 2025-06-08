import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import {
  getProduct,
  getProductIsBookmarked,
  getProductPriceDetail,
  getReservationTotalPrice,
  listOptions,
  listProductComments,
  listReservations,
} from '~/api';

export const useProductData = ({
  token,
  productId,
  selectedChoices,
  quantity,
  selectedTime,
  selectedReservationOption,
}: {
  token: string;
  productId: string;
  selectedChoices: { optionId: string; choiceId: string }[];
  quantity: number;
  selectedTime?: Date;
  selectedReservationOption?: string;
}) => {
  const { data: product, isFetching: isProductFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      return await getProduct(productId);
    },
  });

  const { data: options = [], isFetching: isOptionsFetching } = useQuery({
    queryKey: ['productOption', productId],
    queryFn: async () => {
      return await listOptions(productId);
    },
  });

  const {
    data: productComments,
    isFetching: isProductCommentsFetching,
    isFetchingNextPage: isFetchingMoreProductComments,
    fetchNextPage: fetchMoreProductComments,
    refetch: refetchProductComments,
  } = useInfiniteQuery({
    queryKey: ['productComments', productId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listProductComments(productId, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const { data: reservations = [], isFetching: isReservationsFetching } = useQuery({
    queryKey: ['reservations', productId],
    queryFn: async () => {
      return await listReservations(
        token,
        productId,
        moment().valueOf(),
        moment().endOf('month').valueOf(),
        0
      );
    },
    enabled: product?.productType == 'RESERVATION',
  });

  const orderContent = {
    choices: selectedChoices.map((c) => {
      return c.choiceId;
    }),
    quantity,
  };

  const { data: priceDetail, isFetching: isPriceDetailFetching } = useQuery({
    queryKey: ['priceDetail', productId, selectedChoices, quantity],
    queryFn: async () => {
      return await getProductPriceDetail(token, productId, orderContent);
    },
    enabled: product?.productType == 'ORDER',
  });

  const { data: reservationTotalPrice, isFetching: isReservationTotalPriceFetching } = useQuery({
    queryKey: ['reservationTotalPrice', selectedTime, selectedReservationOption, quantity],
    queryFn: async () => {
      const reservation = reservations.find((f) => {
        return moment(f.time).toISOString() == moment(selectedTime).toISOString();
      });
      if (!reservation || !selectedReservationOption) throw new Error('no reservation');
      const reservationContent = {
        reservation: reservation._id,
        option: selectedReservationOption,
        quantity,
      };

      return await getReservationTotalPrice(token, reservation._id, reservationContent);
    },
    enabled: product?.productType == 'RESERVATION',
  });

  const { data: isBookmarked, refetch: refetchIsBookmarked } = useQuery({
    queryKey: ['productBookmark', productId],
    queryFn: async () => {
      return await getProductIsBookmarked(token, `${productId}`);
    },
  });

  return {
    product,
    isProductFetching,
    options,
    isOptionsFetching,
    productComments,
    isProductCommentsFetching,
    isFetchingMoreProductComments,
    fetchMoreProductComments,
    refetchProductComments,
    reservations,
    isReservationsFetching,
    priceDetail,
    isPriceDetailFetching,
    reservationTotalPrice,
    isReservationTotalPriceFetching,
    isBookmarked,
    refetchIsBookmarked,
  };
};
