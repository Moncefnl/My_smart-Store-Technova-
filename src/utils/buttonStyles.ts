import { CSSProperties } from 'react';
import { StoreButtonConfig, ButtonShape, ButtonShadow, ButtonHoverEffect, ButtonPadding, ButtonFontSize, ButtonFontWeight } from '../types';

export function getButtonRadiusClass(shape?: ButtonShape): string {
  switch (shape) {
    case 'pill':
      return 'rounded-full';
    case 'squircle':
      return 'rounded-2xl';
    case 'rounded_lg':
      return 'rounded-xl';
    case 'rounded_md':
      return 'rounded-lg';
    case 'square':
      return 'rounded-none';
    default:
      return 'rounded-xl';
  }
}

export function getButtonShadowClass(shadow?: ButtonShadow): string {
  switch (shadow) {
    case 'none':
      return 'shadow-none';
    case 'soft':
      return 'shadow-xs';
    case 'medium':
      return 'shadow-md';
    case 'strong':
      return 'shadow-xl';
    case 'glow':
      return 'shadow-md';
    case 'isometric_3d':
      return 'shadow-[0_4px_0_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-none';
    default:
      return 'shadow-sm';
  }
}

export function getButtonHoverClass(hoverEffect?: ButtonHoverEffect): string {
  switch (hoverEffect) {
    case 'scale':
      return 'hover:scale-[1.04] active:scale-95 transition-transform duration-200';
    case 'lift':
      return 'hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95 transition-all duration-200';
    case 'glow':
      return 'hover:brightness-110 hover:shadow-lg active:scale-95 transition-all duration-200';
    case 'pulse':
      return 'hover:animate-pulse active:scale-95 transition-all duration-200';
    case 'shimmer':
      return 'hover:brightness-115 active:scale-95 transition-all duration-200';
    case 'invert':
      return 'hover:opacity-90 active:scale-95 transition-opacity duration-200';
    case 'none':
      return 'active:scale-98 transition-all duration-150';
    default:
      return 'hover:-translate-y-0.5 active:scale-95 transition-all duration-200';
  }
}

export function getButtonPaddingClass(padding?: ButtonPadding): string {
  switch (padding) {
    case 'compact':
      return 'px-3 py-1.5';
    case 'normal':
      return 'px-4 py-2.5';
    case 'spacious':
      return 'px-6 py-3.5';
    default:
      return 'px-4 py-2.5';
  }
}

export function getButtonFontSizeClass(fontSize?: ButtonFontSize): string {
  switch (fontSize) {
    case 'xs':
      return 'text-xs';
    case 'sm':
      return 'text-sm';
    case 'base':
      return 'text-base';
    case 'lg':
      return 'text-lg';
    case 'xl':
      return 'text-xl';
    default:
      return 'text-xs';
  }
}

export function getButtonFontWeightClass(fontWeight?: ButtonFontWeight): string {
  switch (fontWeight) {
    case 'normal':
      return 'font-normal';
    case 'medium':
      return 'font-medium';
    case 'semibold':
      return 'font-semibold';
    case 'bold':
      return 'font-bold';
    case 'extrabold':
      return 'font-extrabold';
    case 'black':
      return 'font-black';
    default:
      return 'font-bold';
  }
}

export function getPrimaryButtonStyles(config?: StoreButtonConfig, customColor?: string): CSSProperties {
  if (!config) {
    return {
      backgroundColor: customColor || '#059669',
      color: '#ffffff',
    };
  }

  const primaryCol = customColor || config.primaryColor || '#059669';
  const textCol = config.primaryTextColor || '#ffffff';

  const style: CSSProperties = {
    color: textCol,
  };

  if (config.styleType === 'gradient') {
    const secCol = config.secondaryColor || config.primaryColor;
    const angle = config.gradientAngle || 135;
    style.background = `linear-gradient(${angle}deg, ${primaryCol}, ${secCol})`;
  } else if (config.styleType === 'outline') {
    style.backgroundColor = 'transparent';
    style.color = primaryCol;
    style.border = `${config.borderWidth === '0px' ? '2px' : config.borderWidth} solid ${config.borderColor || primaryCol}`;
  } else if (config.styleType === 'soft') {
    style.backgroundColor = `${primaryCol}18`; // 10% opacity
    style.color = primaryCol;
  } else if (config.styleType === 'glass') {
    style.backgroundColor = `${primaryCol}cc`;
    style.backdropFilter = 'blur(8px)';
  } else {
    style.backgroundColor = primaryCol;
    if (config.borderWidth && config.borderWidth !== '0px') {
      style.border = `${config.borderWidth} solid ${config.borderColor || primaryCol}`;
    }
  }

  if (config.shadow === 'glow') {
    style.boxShadow = `0 6px 20px -2px ${primaryCol}66`;
  }

  return style;
}

export function getSecondaryButtonStyles(config?: StoreButtonConfig): CSSProperties {
  if (!config) {
    return {
      backgroundColor: '#0f172a',
      color: '#ffffff',
    };
  }

  return {
    backgroundColor: config.secondaryButtonBg || '#0f172a',
    color: config.secondaryButtonText || '#ffffff',
  };
}
