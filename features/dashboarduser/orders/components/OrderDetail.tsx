"use client";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Box,
  Avatar,
} from "@mui/material";
import {
  LocalShipping,
  LocationOn,
  Schedule,
  CheckCircle,
  Pending,
  DirectionsCar,
} from "@mui/icons-material";
import useGetHistoryById from "../queries/useGetHistoryById";
import type { OrderStatus } from "../types/orderTypes";

const statusConfig: Record<
  OrderStatus,
  { color: "warning" | "info" | "success" | "error"; text: string; icon: any }
> = {
  pending: { color: "warning", text: "Pendiente", icon: Pending },
  in_transit: { color: "info", text: "En tránsito", icon: DirectionsCar },
  delivered: { color: "success", text: "Entregado", icon: CheckCircle },
};

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetHistoryById(id as string);

  if (isLoading || !data?.data) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          {isLoading ? "Cargando..." : "No se encontraron datos."}
        </Typography>
      </Container>
    );
  }

  const { order, statusHistory } = data.data;

  return (
    <Container maxWidth="xl" sx={{ py: 2, width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Orden #{order.id}
        </Typography>
        <Chip
          label={
            statusConfig[order.status as OrderStatus]?.text || order.status
          }
          color={statusConfig[order.status as OrderStatus]?.color as any}
          size="medium"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Shipping Info */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <LocalShipping />
            </Avatar>
            <Typography variant="h6" fontWeight="600">
              Información de Envío
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box textAlign="center" flex={1}>
              <LocationOn color="primary" sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Origen
              </Typography>
              <Typography variant="h6" fontWeight="500">
                {order.originCity}
              </Typography>
            </Box>

            <Box sx={{ mx: 2, color: "text.disabled" }}>→</Box>

            <Box textAlign="center" flex={1}>
              <LocationOn color="secondary" sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Destino
              </Typography>
              <Typography variant="h6" fontWeight="500">
                {order.destinationCity}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Status History */}
      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Historial de Estados
      </Typography>

      <Stack spacing={2}>
        {statusHistory.map((status: any, index: number) => {
          const config = statusConfig[status.status as OrderStatus] || {};
          const IconComponent = config.icon || Schedule;

          return (
            <Card
              key={status.id}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                border: index === 0 ? 2 : 1,
                borderColor: index === 0 ? `${config.color}.main` : "divider",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: `${config.color}.main`,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <IconComponent fontSize="small" />
                  </Avatar>

                  <Box flex={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="subtitle1" fontWeight="600">
                        {config.text || status.status}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(status.changed_at).toLocaleString("es-ES", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Typography>
                    </Stack>

                    {status.notes && (
                      <Typography variant="body2" color="text.secondary">
                        {status.notes}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
};

export default OrderDetail;
