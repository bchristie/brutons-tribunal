import { FooterMain } from './FooterMain';
import { FooterSection } from './FooterSection';

// Create compound component
const FooterCompound = FooterMain as typeof FooterMain & {
  Section: typeof FooterSection;
};

// Attach sub-components
FooterCompound.Section = FooterSection;

export { FooterCompound as Footer };
export { FooterSection };
export type * from './Footer.types';