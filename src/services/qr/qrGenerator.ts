/**
 * @file qrGenerator.ts
 * @description Standard scannable QR code and Code 128 barcode generation service.
 * Generates ISO/IEC 18004 compliant QR codes that can be scanned by any smartphone camera.
 */

import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export class QrGenerator {
  /**
   * Resolves the canonical public URL for a given SOAP DNA code.
   * Prioritizes VITE_PUBLIC_APP_URL, PUBLIC_APP_URL, or falls back to window.location.origin.
   */
  public static getPublicSoapUrl(dnaCode: string): string {
    const envUrl =
      (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_PUBLIC_APP_URL || import.meta.env.PUBLIC_APP_URL)) ||
      '';

    let origin = '';
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      origin = window.location.origin;
    }

    const base = envUrl.trim() || origin || 'https://soapify.engineering';
    // Remove trailing slash if present
    const cleanBase = base.replace(/\/+$/, '');
    return `${cleanBase}/soap/${dnaCode}`;
  }

  /**
   * Generates a high-resolution, camera-scannable PNG Data URL for a given string/URL.
   * Configured with optimal contrast, error correction (Level M), and standard quiet zone.
   */
  public static async generateDataUrl(
    text: string,
    options?: { width?: number; margin?: number }
  ): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: options?.width || 320,
        margin: options?.margin !== undefined ? options?.margin : 2,
        color: {
          dark: '#0F172A', // Deep slate for high contrast
          light: '#FFFFFF', // Pure white quiet zone
        },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.error('[QR] Failed to generate data URL:', err);
      return '';
    }
  }

  /**
   * Generates a scalable vector SVG string for maximum printing sharpness.
   */
  public static async generateSvgString(
    text: string,
    options?: { width?: number; margin?: number }
  ): Promise<string> {
    try {
      return await QRCode.toString(text, {
        type: 'svg',
        width: options?.width || 256,
        margin: options?.margin !== undefined ? options?.margin : 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.error('[QR] Failed to generate SVG:', err);
      return '';
    }
  }

  /**
   * Renders a real standard Code 128 1D barcode into an SVG or HTML element.
   */
  public static renderBarcode(
    element: SVGElement | HTMLElement,
    text: string,
    options?: { height?: number; displayValue?: boolean; lineColor?: string }
  ): void {
    try {
      JsBarcode(element, text, {
        format: 'CODE128',
        height: options?.height || 40,
        displayValue: options?.displayValue !== undefined ? options?.displayValue : true,
        font: 'JetBrains Mono',
        fontSize: 12,
        textMargin: 4,
        lineColor: options?.lineColor || '#0F172A',
        background: 'transparent',
      });
    } catch (err) {
      console.warn('[Barcode] Failed to render Code 128 barcode:', err);
    }
  }
}
