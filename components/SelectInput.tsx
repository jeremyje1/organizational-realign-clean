"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  options: Option[] | string[];
  onSelect: (value: any) => void;
  onMultiSelect?: (values: any[]) => void;
  type: 'select' | 'multi-select';
  placeholder?: string;
  initialValue?: any;
  initialValues?: any[];
  searchable?: boolean;
  disabled?: boolean;
}

export function SelectInput({ 
  options, 
  onSelect, 
  onMultiSelect, 
  type, 
  placeholder = "Select an option...", 
  initialValue,
  initialValues = [],
  searchable = false,
  disabled = false 
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [selectedValues, setSelectedValues] = useState<any[]>(initialValues);
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize options to have consistent structure
  const normalizedOptions: Option[] = options.map((option, index) => 
    typeof option === 'string' 
      ? { value: index, label: option }
      : option
  );

  const filteredOptions = searchable 
    ? normalizedOptions.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : normalizedOptions;

  useEffect(() => {
    if (initialValue !== undefined) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (initialValues.length > 0) {
      setSelectedValues(initialValues);
    }
  }, [initialValues]);

  const handleSingleSelect = (option: Option) => {
    setSelectedValue(option.value);
    onSelect(option.value);
    setIsOpen(false);
  };

  const handleMultiSelect = (option: Option) => {
    const isSelected = selectedValues.includes(option.value);
    let newValues: any[];

    if (isSelected) {
      newValues = selectedValues.filter(val => val !== option.value);
    } else {
      newValues = [...selectedValues, option.value];
    }

    setSelectedValues(newValues);
    onMultiSelect?.(newValues);
  };

  const getSelectedLabel = () => {
    if (type === 'select') {
      const option = normalizedOptions.find(opt => opt.value === selectedValue);
      return option?.label || placeholder;
    } else {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = normalizedOptions.find(opt => opt.value === selectedValues[0]);
        return option?.label || `${selectedValues.length} selected`;
      }
      return `${selectedValues.length} options selected`;
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'select') {
      setSelectedValue(null);
      onSelect(null);
    } else {
      setSelectedValues([]);
      onMultiSelect?.([]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`${
            (type === 'select' && selectedValue !== null && selectedValue !== undefined) || 
            (type === 'multi-select' && selectedValues.length > 0)
              ? 'text-slate-100' 
              : 'text-slate-400'
          }`}>
            {getSelectedLabel()}
          </span>
          
          <div className="flex items-center space-x-2">
            {((type === 'select' && selectedValue !== null && selectedValue !== undefined) || 
              (type === 'multi-select' && selectedValues.length > 0)) && (
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                tabIndex={-1}
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-200" />
              </button>
            )}
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full left-0 right-0 z-50 mt-2 card p-2 max-h-60 overflow-hidden">
            {searchable && (
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            )}

            <div className="overflow-y-auto max-h-44 space-y-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-slate-400 text-sm text-center">
                  {searchable && searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = type === 'select' 
                    ? selectedValue === option.value
                    : selectedValues.includes(option.value);

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (type === 'select') {
                          handleSingleSelect(option);
                        } else {
                          handleMultiSelect(option);
                        }
                      }}
                      className={`w-full px-3 py-2 text-left rounded-lg transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                          : 'hover:bg-slate-700/50 text-slate-200'
                      }`}
                    >
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {type === 'multi-select' && selectedValues.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-600/30">
                <div className="text-xs text-slate-400 mb-2">
                  {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedValues.map((value, index) => {
                    const option = normalizedOptions.find(opt => opt.value === value);
                    return option ? (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs"
                      >
                        {option.label}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMultiSelect(option);
                          }}
                          className="hover:bg-purple-500/30 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
