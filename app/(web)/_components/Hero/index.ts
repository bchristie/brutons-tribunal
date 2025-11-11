import { Hero } from './Hero';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroColumn } from './HeroColumn';
import { HeroScrollIndicator } from './HeroScrollIndicator';

// Create compound component
const HeroCompound = Hero as typeof Hero & {
  Background: typeof HeroBackground;
  Content: typeof HeroContent;
  Column: typeof HeroColumn;
  ScrollIndicator: typeof HeroScrollIndicator;
};

// Attach sub-components
HeroCompound.Background = HeroBackground;
HeroCompound.Content = HeroContent;
HeroCompound.Column = HeroColumn;
HeroCompound.ScrollIndicator = HeroScrollIndicator;

export { HeroCompound as Hero };
export { HeroBackground, HeroContent, HeroColumn, HeroScrollIndicator };
export type * from './Hero.types';