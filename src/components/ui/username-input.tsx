import * as React from "react";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UsernameInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showValidation?: boolean;
}

const UsernameInput = React.forwardRef<HTMLInputElement, UsernameInputProps>(
  ({ className, showValidation = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [value, setValue] = React.useState(props.value || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Username validation: 3-20 characters, alphanumeric and underscore only
    const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(value.toString());
    const showIcon = showValidation && value && (isFocused || isValid);

    return (
      <div className="relative">
        <Input
          type="text"
          className={cn(showIcon && "pr-10", className)}
          ref={ref}
          {...props}
          value={value}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) {
              props.onFocus(e);
            }
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) {
              props.onBlur(e);
            }
          }}
        />
        {showIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>
    );
  }
);

UsernameInput.displayName = "UsernameInput";

export { UsernameInput };
