  import { OrderStatus } from 'src/constants/type';
  import { GetOrdersResType } from 'src/schemaValidations/order.schema';
  import { useMemo } from 'react';

  type Statics = {
    status: {
      Pending: number;
      Processing: number;
      Delivered: number;
      Paid: number;
      Rejected: number;
    };
    table: Record<number, Record<number, Partial<Record<OrderStatus, number>>>>;
  };

  type OrderObjectByGuestID = Record<number, GetOrdersResType['data']>;
  type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

  type ServingStatus = 'Pending' | 'Processing' | 'Delivered';

  const servingStatuses: ServingStatus[] = ['Pending', 'Processing', 'Delivered'];

  const isServing = (status: OrderStatus): status is ServingStatus => {
    return servingStatuses.includes(status as ServingStatus);
  };

  export const useOrderService = (orderList: GetOrdersResType['data']) => {
    const result = useMemo(() => {
      const statics: Statics = {
        status: {
          Pending: 0,
          Processing: 0,
          Delivered: 0,
          Paid: 0,
          Rejected: 0
        },
        table: {}
      };

      const orderObjectByGuestId: OrderObjectByGuestID = {};
      const guestByTableNumber: ServingGuestByTableNumber = {};

      orderList.forEach((order) => {
        statics.status[order.status] = (statics.status[order.status] || 0) + 1;

        if (order.tableNumber !== null && order.guestId !== null) {
          const tableNumber = order.tableNumber;
          const guestId = order.guestId;

          if (!statics.table[tableNumber]) {
            statics.table[tableNumber] = {};
          }

          if (!statics.table[tableNumber][guestId]) {
            statics.table[tableNumber][guestId] = {};
          }

          statics.table[tableNumber][guestId][order.status] =
            (statics.table[tableNumber][guestId]?.[order.status] || 0) + 1;
        }

        if (order.guestId) {
          if (!orderObjectByGuestId[order.guestId]) {
            orderObjectByGuestId[order.guestId] = [];
          }
          orderObjectByGuestId[order.guestId].push(order);
        }

        if (order.tableNumber && order.guestId) {
          if (!guestByTableNumber[order.tableNumber]) {
            guestByTableNumber[order.tableNumber] = {};
          }
          guestByTableNumber[order.tableNumber][order.guestId] = orderObjectByGuestId[order.guestId];
        }
      });

      const servingGuestByTableNumber: ServingGuestByTableNumber = {};

      for (const tableNumber in guestByTableNumber) {
        const guestObject = guestByTableNumber[tableNumber];
        const servingGuestObject: OrderObjectByGuestID = {};

        for (const guestId in guestObject) {
          const guestOrders = guestObject[guestId];
          const isServingGuest = guestOrders.some((order) => isServing(order.status));

          if (isServingGuest) {
            servingGuestObject[Number(guestId)] = guestOrders;
          }
        }

        if (Object.keys(servingGuestObject).length > 0) {
          servingGuestByTableNumber[Number(tableNumber)] = servingGuestObject;
        }
      }

      return {
        statics,
        orderObjectByGuestId,
        servingGuestByTableNumber
      };
    }, [orderList]);

    return result;
  };
