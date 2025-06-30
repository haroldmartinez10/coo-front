import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  Chip,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
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

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { useUpdateStatusOrder } from "../mutations/useUpdateStatusOrder";
import { useQueryClient } from "@tanstack/react-query";
import ORDER_QUERY_KEYS from "../constants/OrderQueryKeys";

const statusConfig: Record<
  OrderStatus,
  { color: "warning" | "info" | "success" | "error"; text: string; icon: any }
> = {
  pending: { color: "warning", text: "Pendiente", icon: Pending },
  in_transit: { color: "info", text: "En tránsito", icon: DirectionsCar },
  delivered: { color: "success", text: "Entregado", icon: CheckCircle },
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "in_transit", label: "En tránsito" },
  { value: "delivered", label: "Entregado" },
];

const OrdersTable = ({ orders }: { orders: Order[] }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [updatingOrderId, setUpdatingOrderId] = React.useState<number | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<{
    id: number;
    newStatus: OrderStatus;
  } | null>(null);
  const [note, setNote] = React.useState("");
  const [noteError, setNoteError] = React.useState("");

  const role = useAppSelector((state) => state.auth.user?.role);
  const isAdmin = role === "admin";

  const { updateStatusOrderAsync, isPending } = useUpdateStatusOrder({
    onSuccess: () => {
      setUpdatingOrderId(null);
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEYS.ORDERS] });
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      setUpdatingOrderId(null);
    },
  });

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    setSelectedOrder({ id: orderId, newStatus });
    setNote("");
    setNoteError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setNote("");
    setNoteError("");
  };

  const handleConfirmStatusChange = async () => {
    if (!note.trim()) {
      setNoteError("La nota es requerida");
      return;
    }

    if (!selectedOrder) return;

    setUpdatingOrderId(selectedOrder.id);

    try {
      await updateStatusOrderAsync({
        id: selectedOrder.id.toString(),
        body: {
          newStatus: selectedOrder.newStatus,
          notes: note.trim(),
        },
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdatingOrderId(null);
    }
  };

  const renderStatusCell = (order: Order) => {
    const config = statusConfig[order.status as OrderStatus] || {};
    const IconComponent = config.icon || Pending;

    if (isAdmin) {
      return (
        <Select
          value={order.status}
          onChange={(e) =>
            handleStatusChange(order.id, e.target.value as OrderStatus)
          }
          disabled={updatingOrderId === order.id}
          displayEmpty
          variant="standard"
          disableUnderline
          sx={{
            "& .MuiSelect-select": {
              padding: 0,
              border: "none",
              outline: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSelect-icon": {
              display: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          renderValue={(value) => (
            <Chip
              label={statusConfig[value as OrderStatus]?.text || value}
              color={statusConfig[value as OrderStatus]?.color as any}
              size="small"
              icon={
                updatingOrderId === order.id ? (
                  <CircularProgress size={14} />
                ) : (
                  <IconComponent fontSize="small" />
                )
              }
              sx={{
                fontWeight: 500,
                minWidth: 100,
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
          )}
        >
          {statusOptions.map((option) => {
            const OptionIcon = statusConfig[option.value].icon;
            return (
              <MenuItem key={option.value} value={option.value}>
                <Chip
                  label={option.label}
                  color={statusConfig[option.value].color as any}
                  size="small"
                  icon={<OptionIcon fontSize="small" />}
                  variant="outlined"
                />
              </MenuItem>
            );
          })}
        </Select>
      );
    }

    return (
      <Chip
        label={config.text || order.status}
        color={config.color as any}
        size="small"
        icon={<IconComponent fontSize="small" />}
        sx={{ fontWeight: 500 }}
      />
    );
  };

  return (
    <>
      <TableContainer sx={{ p: 2 }} component={Paper}>
        <Typography variant="h4" gutterBottom>
          {isAdmin ? "Administrar Órdenes" : "Mis órdenes"} (Web Sockets)
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
                <TableCell>{renderStatusCell(order)}</TableCell>
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

      {/* Modal para agregar nota */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cambiar Estado de la Orden</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedOrder && (
              <>
                Cambiando estado a:{" "}
                <Chip
                  label={statusConfig[selectedOrder.newStatus]?.text}
                  color={statusConfig[selectedOrder.newStatus]?.color as any}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </>
            )}
          </Typography>

          <TextField
            autoFocus
            margin="dense"
            label="Nota del cambio de estado"
            placeholder="Ej: Paquete recogido desde el almacén, en camino al destino..."
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (noteError) setNoteError("");
            }}
            error={!!noteError}
            helperText={
              noteError || "Describe el motivo o detalles del cambio de estado"
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmStatusChange}
            variant="contained"
            disabled={isPending || !note.trim()}
            startIcon={isPending ? <CircularProgress size={16} /> : null}
          >
            {isPending ? "Guardando..." : "Confirmar Cambio"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrdersTable;
