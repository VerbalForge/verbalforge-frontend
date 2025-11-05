import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, LucideIcon } from 'lucide-react';

export interface BulkAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
}

interface BulkActionsBarProps {
  selectedCount: number;
  entityNamePlural: string;
  actions: BulkAction[];
  loading?: boolean;
}

export function BulkActionsBar({ 
  selectedCount, 
  entityNamePlural, 
  actions,
  loading = false 
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
      <span className="text-sm font-medium">
        {selectedCount} {entityNamePlural}{selectedCount > 1 ? '' : ' (single)'} selected
      </span>
      <div className="flex gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.key}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              disabled={loading}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// Predefined common bulk actions
export const createPublishAction = (onPublish: () => void): BulkAction => ({
  key: 'publish',
  label: 'Publish Selected',
  icon: Eye,
  variant: 'outline',
  onClick: onPublish,
});

export const createUnpublishAction = (onUnpublish: () => void): BulkAction => ({
  key: 'unpublish',
  label: 'Unpublish Selected',
  icon: EyeOff,
  variant: 'outline',
  onClick: onUnpublish,
});

export const createDeleteAction = (onDelete: () => void): BulkAction => ({
  key: 'delete',
  label: 'Delete Selected',
  icon: Trash2,
  variant: 'destructive',
  onClick: onDelete,
});
