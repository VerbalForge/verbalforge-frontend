"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  singleSelect?: boolean
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select items...",
  className,
  singleSelect = false
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    return options.filter(option =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  const handleSelectAll = () => {
    if (selected.length === filteredOptions.length) {
      // Unselect all filtered options
      onSelectionChange(selected.filter(item => !filteredOptions.includes(item)))
    } else {
      // Select all filtered options
      const newSelected = [...new Set([...selected, ...filteredOptions])]
      onSelectionChange(newSelected)
    }
  }

  const handleSelectOption = (option: string, checked: boolean) => {
    if (singleSelect) {
      // For single select, replace the selection
      if (checked) {
        onSelectionChange([option])
        setOpen(false) // Close dropdown after selection
      } else {
        onSelectionChange([])
      }
    } else {
      // For multi select, add/remove from selection
      if (checked) {
        onSelectionChange([...selected, option])
      } else {
        onSelectionChange(selected.filter(item => item !== option))
      }
    }
  }

  const handleRemoveTag = (option: string) => {
    onSelectionChange(selected.filter(item => item !== option))
  }

  const isAllSelected = filteredOptions.length > 0 && 
    filteredOptions.every(option => selected.includes(option))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-w-[200px] justify-between h-auto min-h-[40px] p-2",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : selected.length <= 3 ? (
              selected.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="text-xs h-5 px-1"
                >
                  {item}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemoveTag(item)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleRemoveTag(item)}
                  >
                    <X className="h-2 w-2 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="text-xs h-5">
                {selected.length} selected
              </Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {/* Select All Option - only for multi-select */}
          {!singleSelect && filteredOptions.length > 1 && (
            <div className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                All
              </label>
            </div>
          )}
          
          {/* Individual Options */}
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <Checkbox
                id={option}
                checked={selected.includes(option)}
                onCheckedChange={(checked) => handleSelectOption(option, !!checked)}
              />
              <label
                htmlFor={option}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {option}
              </label>
            </div>
          ))}
          
          {filteredOptions.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}