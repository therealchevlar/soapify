/**
 * @file QRCode.tsx
 * @description Standard reusable QR code component powered by qrcode.react.
 * Produces crisp, laser- & camera-scannable QR codes for SOAP DNA profiles.
 */

import React from 'react';
import { QRCodeComponent } from '../QRCodeComponent';

export interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  showDownload?: boolean;
  showPrint?: boolean;
  downloadFilename?: string;
  label?: string;
  onDownload?: (dataUrl: string) => void;
  onPrint?: () => void;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  className = '',
  showDownload = false,
  showPrint = false,
  downloadFilename = 'soapify-dna-qr',
  label,
  onDownload,
  onPrint,
}) => {
  return (
    <QRCodeComponent
      value={value}
      size={size}
      className={className}
      showDownload={showDownload}
      showPrint={showPrint}
      downloadFilename={downloadFilename}
      label={label}
      onDownload={onDownload}
      onPrint={onPrint}
    />
  );
};

export default QRCode;
