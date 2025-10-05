import * as React from "react";
import { Input } from "@/components/ui/input";
import { Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import COUNTRIES from "@/data/countries.json";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showValidation?: boolean;
  countryCode?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, showValidation = true, disabled, countryCode = "+1", ...props }, ref) => {
    const [phoneNumber, setPhoneNumber] = React.useState(value);
    const [selectedCode, setSelectedCode] = React.useState(countryCode);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    // Format phone number as XXXXX-XXXXX
    const formatPhoneNumber = (num: string) => {
      // Remove all non-digits
      const digits = num.replace(/\D/g, "");
      
      // Format as XXXXX-XXXXX
      if (digits.length <= 5) {
        return digits;
      } else if (digits.length <= 10) {
        return `${digits.slice(0, 5)}-${digits.slice(5)}`;
      } else {
        return `${digits.slice(0, 5)}-${digits.slice(5, 10)}`;
      }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = formatPhoneNumber(rawValue);
      setPhoneNumber(formatted);
      
      // Create a synthetic event with formatted value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
          name: e.target.name,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange?.(syntheticEvent);
    };

    const handleCountrySelect = (code: string) => {
      setSelectedCode(code);
      setIsOpen(false);
      setSearchQuery("");
    };

    // Filter countries based on search query
    const filteredCountries = React.useMemo(() => {
      if (!searchQuery) return COUNTRIES;
      const query = searchQuery.toLowerCase();
      return COUNTRIES.filter(
        (country) =>
          country.country.toLowerCase().includes(query) ||
          country.code.includes(query)
      );
    }, [searchQuery]);

    // Validate phone number (10 digits for most countries)
    const isValid = phoneNumber.replace(/\D/g, "").length === 10;
    const showIcon = showValidation && phoneNumber && !disabled;

    React.useEffect(() => {
      // Update internal state if external value changes
      if (value !== phoneNumber) {
        setPhoneNumber(formatPhoneNumber(value));
      }
    }, [value, phoneNumber]);

    // Get selected country info
    const selectedCountry = COUNTRIES.find(c => c.code === selectedCode) || COUNTRIES[0];

    return (
      <div className="flex gap-2">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="w-[110px] justify-between"
              type="button"
            >
              <span className="truncate">
                {selectedCountry.flag} {selectedCode}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px] p-0">
            <div className="p-2 bg-background border-b">
              <Input
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8"
                autoFocus
              />
            </div>
            <div className="max-h-[250px] overflow-y-auto py-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <DropdownMenuItem
                    key={`${country.code}-${country.country}-${index}`}
                    onClick={() => handleCountrySelect(country.code)}
                    className="cursor-pointer flex items-center"
                  >
                    <span className="mr-2">{country.flag}</span>
                    <span className="font-medium w-[40px] inline-block">{country.code}</span>
                    <span className="text-muted-foreground">- {country.country}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No countries found.
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="relative flex-1">
          <Input
            type="tel"
            className={cn(showIcon && "pr-10", className)}
            ref={ref}
            {...props}
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="XXXXX-XXXXX"
            maxLength={11} // 5 digits + hyphen + 5 digits
            disabled={disabled}
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
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
