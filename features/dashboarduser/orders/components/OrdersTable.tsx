import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Typography } from "@mui/material";
import {
  Visibility,
  CheckCircle,
  Pending,
  DirectionsCar,
} from "@mui/icons-material";
import {
  Order,
  OrderStatus,
} from "@/features/dashboarduser/orders/types/orderTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusConfig: Record<
  OrderStatus,
  { color: "warning" | "info" | "success" | "error"; text: string; icon: any }
> = {
  pending: { color: "warning", text: "Pendiente", icon: Pending },
  in_transit: { color: "info", text: "En tránsito", icon: DirectionsCar },
  delivered: { color: "success", text: "Entregado", icon: CheckCircle },
};

const OrdersTable = ({ orders }: { orders: Order[] }) => {
  const router = useRouter();
  return (
    <>
      <TableContainer sx={{ p: 2 }} component={Paper}>
        <Typography variant="h4" gutterBottom>
          Mis órdenes (Web Sockets)
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Código de Rastreo</TableCell>
              <TableCell>Ciudad Origen</TableCell>
              <TableCell>Ciudad Destino</TableCell>
              <TableCell align="right">Peso (kg)</TableCell>
              <TableCell align="right">Precio Base</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.trackingCode}
                </TableCell>
                <TableCell>{order.originCity}</TableCell>
                <TableCell>{order.destinationCity}</TableCell>
                <TableCell align="right">{order.weight}</TableCell>
                <TableCell align="right">${order.basePrice}</TableCell>
                <TableCell>
                  {(() => {
                    const config =
                      statusConfig[order.status as OrderStatus] || {};
                    const IconComponent = config.icon || Pending;
                    return (
                      <Chip
                        label={config.text || order.status}
                        color={config.color as any}
                        size="small"
                        icon={<IconComponent fontSize="small" />}
                        sx={{ fontWeight: 500 }}
                      />
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      router.push(`/orders/${order.id}`);
                    }}
                    component="a"
                    variant="contained"
                    size="small"
                    startIcon={<Visibility />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      minWidth: "auto",
                      px: 2,
                    }}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrdersTable;
