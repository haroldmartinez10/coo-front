import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Field } from "formik";
import { CITIES } from "@/features/dashboarduser/quotes/constants/cities";

export const CitySelect = ({
  name,
  label,
  disabled,
}: {
  name: string;
  label: string;
  disabled?: boolean;
}) => (
  <Field name={name}>
    {({ field, meta }: any) => (
      <FormControl
        fullWidth
        error={meta.touched && Boolean(meta.error)}
        required
      >
        <InputLabel>{label}</InputLabel>
        <Select
          {...field}
          label={label}
          value={field.value || ""}
          disabled={disabled}
        >
          {CITIES.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
        {meta.touched && meta.error && (
          <FormHelperText>{meta.error}</FormHelperText>
        )}
      </FormControl>
    )}
  </Field>
);
