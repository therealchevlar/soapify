/**
 * @file Barcode.tsx
 * @description Exporting standard Barcode component powered by jsbarcode.
 */

import React from 'react';
import { BarcodeComponent, BarcodeComponentProps } from '../BarcodeComponent';

export interface BarcodeProps {
  value: string;
  height?: number;
  displayValue?: boolean;
  className?: string;
  barColor?: string;
  bgColor?: string;
  moduleWidth?: number;
  showDownload?: boolean;
  showPrint?: boolean;
  onDownload?: (dataUrl: string) => void;
  onPrint?: () => void;
}

export const Barcode: React.FC<BarcodeProps> = ({
  value,
  height = 42,
  displayValue = true,
  className = '',
  barColor = '#0F172A',
  bgColor = '#FFFFFF',
  moduleWidth = 2,
  showDownload = false,
  showPrint = false,
  onDownload,
  onPrint,
}) => {
  return (
    <BarcodeComponent
      value={value}
      height={height}
      displayValue={displayValue}
      className={className}
      lineColor={barColor}
      background={bgColor}
      width={moduleWidth}
      showDownload={showDownload}
      showPrint={showPrint}
      onDownload={onDownload}
      onPrint={onPrint}
    />
  );
};

export default Barcode;
