import Label from "./Label";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import "./FormField.css";

function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error,
  options = [], // For select
  rows = 4, // For textarea
  className = "",
}) {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
          >
            <option value="">{placeholder || "Select an option"}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
          />
        );
      default:
        return (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {renderInput()}
      {error && <span className="form-field-error">{error}</span>}
    </div>
  );
}

export default FormField;
