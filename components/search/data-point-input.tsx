"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DATA_POINT_TYPES, type DataPointType } from "@/lib/constants";
import { validateDataPoint } from "@/lib/utils/validation";

export interface DataPointEntry {
  id: string;
  type: DataPointType;
  value: string;
}

const PLACEHOLDERS: Record<DataPointType, string> = {
  phone: "e.g., 012-345 6789",
  email: "e.g., example@email.com",
  bank_account: "e.g., 1234567890",
  whatsapp: "e.g., +60123456789",
  telegram: "e.g., @username",
  ewallet: "e.g., 012-3456789",
  social_media: "e.g., facebook.com/username",
  website: "e.g., https://example.com",
  crypto_wallet: "e.g., 0x1234...",
  name: "e.g., John Smith",
  company: "e.g., ABC Company Sdn Bhd",
};

const INPUT_MODES: Record<DataPointType, React.HTMLAttributes<HTMLInputElement>["inputMode"]> = {
  phone: "tel",
  whatsapp: "tel",
  ewallet: "tel",
  email: "email",
  bank_account: "numeric",
  website: "url",
  social_media: "url",
  telegram: "text",
  crypto_wallet: "text",
  name: "text",
  company: "text",
};

const AUTOCOMPLETE: Record<DataPointType, string> = {
  phone: "tel",
  whatsapp: "tel",
  ewallet: "off",
  email: "email",
  bank_account: "off",
  website: "url",
  social_media: "url",
  telegram: "off",
  crypto_wallet: "off",
  name: "name",
  company: "organization",
};

interface DataPointInputProps {
  dataPoints: DataPointEntry[];
  onChange: (dataPoints: DataPointEntry[]) => void;
  errors?: Record<string, string>;
}

export function DataPointInput({
  dataPoints,
  onChange,
  errors = {},
}: DataPointInputProps) {
  const typeOptions = Object.entries(DATA_POINT_TYPES).map(([value, label]) => ({
    value,
    label,
  }));

  const addDataPoint = () => {
    const newPoint: DataPointEntry = {
      id: crypto.randomUUID(),
      type: "phone",
      value: "",
    };
    onChange([...dataPoints, newPoint]);
  };

  const removeDataPoint = (id: string) => {
    if (dataPoints.length > 1) {
      onChange(dataPoints.filter((dp) => dp.id !== id));
    }
  };

  const updateDataPoint = (
    id: string,
    field: "type" | "value",
    value: string
  ) => {
    onChange(
      dataPoints.map((dp) =>
        dp.id === id ? { ...dp, [field]: value } : dp
      )
    );
  };

  return (
    <div className="space-y-4">
      <Label>Information to Check</Label>
      
      {dataPoints.map((dp, index) => (
        <div key={dp.id} className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-start">
          <div className="w-full sm:w-40 sm:flex-shrink-0">
            <Select
              value={dp.type}
              onChange={(e) =>
                updateDataPoint(dp.id, "type", e.target.value)
              }
              options={typeOptions}
              aria-label={`Field ${index + 1} type`}
            />
          </div>
          <div className="flex gap-2 sm:flex-1 sm:gap-3">
            <div className="flex-1 min-w-0">
              <Input
                value={dp.value}
                onChange={(e) => updateDataPoint(dp.id, "value", e.target.value)}
                placeholder={PLACEHOLDERS[dp.type] || "Enter value"}
                inputMode={INPUT_MODES[dp.type]}
                autoComplete={AUTOCOMPLETE[dp.type]}
                aria-label={`${DATA_POINT_TYPES[dp.type]} value`}
                className={errors[dp.id] ? "border-destructive" : ""}
              />
              {errors[dp.id] && (
                <p className="text-sm text-destructive mt-1">{errors[dp.id]}</p>
              )}
            </div>
            {dataPoints.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeDataPoint(dp.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addDataPoint}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Field
      </Button>
    </div>
  );
}
