/**
 * @file QRCodeComponent.tsx
 * @description Production-grade reusable QR Code component powered by qrcode.react.
 * Offers high-density vector SVG rendering, embedded logo support, and download/print callbacks.
 */

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';

export interface QRCodeComponentProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
  showDownload?: boolean;
  showPrint?: boolean;
  downloadFilename?: string;
  label?: string;
  onDownload?: (dataUrl: string) => void;
  onPrint?: () => void;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  value,
  size = 192,
  fgColor = '#0F172A',
  bgColor = '#FFFFFF',
  level = 'M',
  includeMargin = true,
  className = '',
  showDownload = false,
  showPrint = false,
  downloadFilename = 'soapify-dna-qr',
  label,
  onDownload,
  onPrint,
  imageSettings,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgEl);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      if (onDownload) {
        onDownload(url);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${downloadFilename}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      console.error('Download QR failed:', e);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }

    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SOAPIFY QR Code</title>
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
              padding: 24px;
              border: 1px dashed #94a3b8;
              border-radius: 12px;
            }
            .val {
              margin-top: 12px;
              font-size: 11px;
              color: #64748b;
              word-break: break-all;
              max-width: 260px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h3 style="margin-top:0;">SOAPIFY SOAP DNA</h3>
            ${svgString}
            <div class="val">${value}</div>
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
      <div className="p-3 bg-white rounded-3xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md hover:border-sky-200">
        <QRCodeSVG
          value={value}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          level={level}
          includeMargin={includeMargin}
          imageSettings={imageSettings}
          className="rounded-2xl block"
        />
      </div>

      {label && (
        <span className="text-xs font-mono text-slate-500 mt-2 font-medium">
          {label}
        </span>
      )}

      {(showDownload || showPrint || onDownload || onPrint) && (
        <div className="flex items-center gap-2 mt-3">
          {(showDownload || onDownload) && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-600 hover:text-sky-700 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
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

export default QRCodeComponent;
