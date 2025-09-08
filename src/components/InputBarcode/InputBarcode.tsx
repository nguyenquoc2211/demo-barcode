"use client"
import {useEffect, useRef, useState} from "react";

function InputBarcode() {
  const bufferRef = useRef<string>('');
  const [scanned, setScanned] = useState<string>('');

  const handleInputBarcode = (e: KeyboardEvent)=> {
    if (e.key === 'Enter' || e.key === 'Return') {
      setScanned(bufferRef.current);
      bufferRef.current = '';
    }
      else {
      bufferRef.current += e.key;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleInputBarcode)

    // Clear when hook is destroyed
    return () => document.removeEventListener('keydown', handleInputBarcode);
  }, []);

  useEffect(() => {
    console.log("Scanned", scanned)
  }, [scanned]);
  return (
    <div>
      <p>📦 Dữ liệu đã quét: <strong>{scanned}</strong></p>
    </div>
  )
}

export default InputBarcode;