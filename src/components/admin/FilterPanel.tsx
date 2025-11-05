import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'search';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onReset?: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onReset,
  className,
}: FilterPanelProps) {
  const hasActiveFilters = Object.values(values).some((v) => v);

  return (
    <div className={`border rounded-lg bg-card ${className}`}>
      <div className="px-4 py-2.5 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="grid gap-4 lg:grid-cols-4">
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-3">
              <Label htmlFor={filter.id} className="text-sm font-medium whitespace-nowrap">
                {filter.label}
              </Label>
              {filter.type === 'select' ? (
                <Select
                  value={values[filter.id] || 'all'}
                  onValueChange={(value) => onChange(filter.id, value === 'all' ? '' : value)}
                >
                  <SelectTrigger id={filter.id} className="flex-1">
                    <SelectValue placeholder={filter.placeholder || 'Select...'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {filter.options?.filter(opt => opt.value && opt.value !== '').map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={filter.id}
                  placeholder={filter.placeholder || 'Search...'}
                  value={values[filter.id] || ''}
                  onChange={(e) => onChange(filter.id, e.target.value)}
                  className="flex-1"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
