/**
 * @file BarcodeComponent.tsx
 * @description Production-grade reusable Barcode component powered by jsbarcode (Code 128 / CODE39 / EAN).
 * Handles encoding, error tolerance, SVG/Canvas rendering, download, and print callbacks.
 */

import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, Printer, AlertCircle } from 'lucide-react';

export interface BarcodeComponentProps {
  value: string;
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'UPC';
  width?: number;
  height?: number;
  displayValue?: boolean;
  text?: string;
  fontOptions?: string;
  font?: string;
  fontSize?: number;
  textAlign?: string;
  textPosition?: string;
  textMargin?: number;
  background?: string;
  lineColor?: string;
  margin?: number;
  className?: string;
  showDownload?: boolean;
  showPrint?: boolean;
  onDownload?: (dataUrl: string) => void;
  onPrint?: () => void;
}

export const BarcodeComponent: React.FC<BarcodeComponentProps> = ({
  value,
  format = 'CODE128',
  width = 2,
  height = 42,
  displayValue = true,
  text,
  font = 'JetBrains Mono, monospace',
  fontSize = 13,
  background = '#FFFFFF',
  lineColor = '#0F172A',
  margin = 8,
  className = '',
  showDownload = false,
  showPrint = false,
  onDownload,
  onPrint,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;

    try {
      setError(null);
      JsBarcode(svgRef.current, value, {
        format,
        width,
        height,
        displayValue,
        text: text || value,
        font,
        fontSize,
        background,
        lineColor,
        margin,
      });
    } catch (err: unknown) {
      console.error('Barcode generation error:', err);
      setError(err instanceof Error ? err.message : 'Invalid barcode value');
    }
  }, [value, format, width, height, displayValue, text, font, fontSize, background, lineColor, margin]);

  const handleDownload = () => {
    if (!svgRef.current) return;
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgRef.current);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      if (onDownload) {
        onDownload(url);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = `SOAPIFY-barcode-${value}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      console.error('Download barcode failed:', e);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }

    if (!svgRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SOAPIFY Barcode - ${value}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: sans-serif;
            }
            .wrapper {
              text-align: center;
              padding: 20px;
              border: 1px dashed #cbd5e1;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h3>SOAPIFY Batch Identity</h3>
            ${svgString}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div ref={containerRef} className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md max-w-full overflow-x-auto flex justify-center">
        {error ? (
          <div className="flex items-center gap-2 px-4 py-3 text-xs text-rose-600 font-mono bg-rose-50 rounded-xl">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Barcode Error: {error}</span>
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="max-w-full h-auto block select-none"
            aria-label={`Barcode for ${value}`}
          />
        )}
      </div>

      {(showDownload || showPrint || onDownload || onPrint) && !error && (
        <div className="flex items-center gap-2 mt-2.5">
          {(showDownload || onDownload) && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-600 hover:text-sky-700 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Barcode</span>
            </button>
          )}

          {(showPrint || onPrint) && (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-600 hover:text-sky-700 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BarcodeComponent;
