"use client";
import React from "react";
import useGetOrders from "@/features/dashboarduser/orders/queries/useGetOrders";
import OrdersTable from "./components/OrdersTable";

const OrdersPage = () => {
  const { data, isLoading } = useGetOrders();

  return (
    <>
      <OrdersTable orders={data?.data || []} />
    </>
  );
};

export default OrdersPage;
