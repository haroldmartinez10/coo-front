import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import OrdersTable from "../OrdersTable";
import { Order } from "@/features/dashboarduser/orders/types/orderTypes";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../mutations/useUpdateStatusOrder", () => ({
  useUpdateStatusOrder: () => ({
    updateStatusOrderAsync: jest.fn(),
    isPending: false,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

jest.mock("@/shared/hooks/reduxHooks", () => ({
  useAppSelector: jest.fn(() => ({
    user: { role: "user" },
  })),
}));

const mockStore = configureStore({
  reducer: {
    auth: (state = { user: { role: "user" }, token: null }) => state,
  },
});

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    originCity: "Bogotá",
    destinationCity: "Medellín",
    weight: 10,
    height: 20,
    width: 30,
    length: 40,
    basePrice: 50000,
    trackingCode: "COO-001",
    status: "pending",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    userId: 1,
    originCity: "Cali",
    destinationCity: "Barranquilla",
    weight: 15,
    height: 25,
    width: 35,
    length: 45,
    basePrice: 75000,
    trackingCode: "COO-002",
    status: "in_transit",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
];

describe("OrdersTable", () => {
  it("debe renderizar la tabla de órdenes correctamente", () => {
    renderWithProviders(<OrdersTable orders={mockOrders} />);

    expect(screen.getByText("Mis órdenes (Web Sockets)")).toBeInTheDocument();

    expect(screen.getByText("Código de Rastreo")).toBeInTheDocument();
    expect(screen.getByText("Ciudad Origen")).toBeInTheDocument();
    expect(screen.getByText("Ciudad Destino")).toBeInTheDocument();
    expect(screen.getByText("Peso (kg)")).toBeInTheDocument();
    expect(screen.getByText("Precio Base")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
    expect(screen.getByText("Fecha de Creación")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  it("debe renderizar las órdenes en la tabla", () => {
    renderWithProviders(<OrdersTable orders={mockOrders} />);

    expect(screen.getByText("COO-001")).toBeInTheDocument();
    expect(screen.getByText("COO-002")).toBeInTheDocument();
    expect(screen.getByText("Bogotá")).toBeInTheDocument();
    expect(screen.getByText("Medellín")).toBeInTheDocument();
    expect(screen.getByText("Cali")).toBeInTheDocument();
    expect(screen.getByText("Barranquilla")).toBeInTheDocument();
  });

  it("debe renderizar correctamente con una lista vacía de órdenes", () => {
    renderWithProviders(<OrdersTable orders={[]} />);

    expect(screen.getByText("Mis órdenes (Web Sockets)")).toBeInTheDocument();

    expect(screen.getByText("Código de Rastreo")).toBeInTheDocument();
    expect(screen.getByText("Ciudad Origen")).toBeInTheDocument();
  });

  it("debe mostrar botones de Ver para cada orden", () => {
    renderWithProviders(<OrdersTable orders={mockOrders} />);

    const verButtons = screen.getAllByText("Ver");
    expect(verButtons).toHaveLength(mockOrders.length);
  });
});
