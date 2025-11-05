import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';

export interface FilterConfig {
  type: 'search' | 'select' | 'multiselect';
  key: string;
  label: string;
  placeholder: string;
  options?: { label: string; value: string }[] | string[];
  value?: string | string[];
}

interface AdminFiltersProps {
  configs: FilterConfig[];
  values: Record<string, string | string[]>;
  onChange: (key: string, value: string | string[]) => void;
  onReset: () => void;
}

export function AdminFilters({ configs, values, onChange, onReset }: AdminFiltersProps) {
  const renderFilter = (config: FilterConfig) => {
    switch (config.type) {
      case 'search':
        return (
          <div key={config.key}>
            <label className="text-sm font-medium mb-2 block">{config.label}</label>
            <Input
              placeholder={config.placeholder}
              value={(values[config.key] as string) || ''}
              onChange={(e) => onChange(config.key, e.target.value)}
            />
          </div>
        );

      case 'select':
        const selectOptions = config.options || [];
        const normalizedOptions = selectOptions.map(opt =>
          typeof opt === 'string' ? { label: opt, value: opt.toLowerCase() } : opt
        );

        return (
          <div key={config.key}>
            <label className="text-sm font-medium mb-2 block">{config.label}</label>
            <Select
              value={(values[config.key] as string) || 'all'}
              onValueChange={(value) => onChange(config.key, value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={config.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{config.placeholder}</SelectItem>
                {normalizedOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        const multiselectOptions = (config.options || []) as string[];
        return (
          <div key={config.key}>
            <label className="text-sm font-medium mb-2 block">{config.label}</label>
            <MultiSelect
              options={multiselectOptions}
              selected={(values[config.key] as string[]) || []}
              onSelectionChange={(selected) => onChange(config.key, selected)}
              placeholder={config.placeholder}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-end gap-2">
      <div className="flex gap-2 items-end">
        {configs.map(renderFilter)}
      </div>
      <div>
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
