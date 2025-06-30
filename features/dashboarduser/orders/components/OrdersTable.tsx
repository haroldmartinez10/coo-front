import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Order } from "@/features/dashboarduser/orders/types/orderTypes";
import Link from "next/link";

const OrdersTable = ({ orders }: { orders: Order[] }) => {
  return (
    <TableContainer component={Paper}>
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
              <TableCell>{order.status}</TableCell>

              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link prefetch href={`/orders/${order.id}`}>
                  Ver
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
