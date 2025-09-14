"use client";
import React, { useRef, useEffect, useState } from "react";
import { Input } from "antd";
import type { InputRef } from "antd";

const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface InputBarcodeProps {
  onScan: (barcode: string) => void;
}

function InputBarcode({ onScan }: InputBarcodeProps) {
  const [value, setValue] = useState('');
  const bufferRef = useRef<string>("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.input) {
      inputRef.current.input.focus()
    }
  }, []);

  const handleInputBarcode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "Enter" || key === "Return") {
      const scanned = bufferRef.current.trim();
      if (scanned) {
        onScan(scanned);
        bufferRef.current = "";
        if (inputRef.current?.input) {
          inputRef.current.input.value = ""; // Xóa giá trị hiển thị
          inputRef.current.focus(); // Focus lại input
          setValue("");
        }
      }
    } else {
      if (!charset.includes(key)) return;
      bufferRef.current += key;
      setValue(bufferRef.current); // cập nhật giá trị hiển thị
    }
  };

  return (
    <Input
      ref={inputRef}
      className="w-full input-barcode"
      onKeyDown={handleInputBarcode}
      placeholder="Quét hoặc nhập mã barcode..."
      value={value}
      onBlur={() => {
        setValue("")
        bufferRef.current = "";
      }}
    />
  );
}

export default InputBarcode;
