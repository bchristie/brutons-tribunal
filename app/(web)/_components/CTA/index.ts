import { CTAMain } from './CTAMain';
import { CTATitle } from './CTATitle';
import { CTABody } from './CTABody';
import { CTAActions } from './CTAActions';
import { CTAButton } from './CTAButton';

// Create compound component
const CTACompound = CTAMain as typeof CTAMain & {
  Title: typeof CTATitle;
  Body: typeof CTABody;
  Actions: typeof CTAActions;
  Button: typeof CTAButton;
};

// Attach sub-components
CTACompound.Title = CTATitle;
CTACompound.Body = CTABody;
CTACompound.Actions = CTAActions;
CTACompound.Button = CTAButton;

export { CTACompound as CTA };
export { CTATitle, CTABody, CTAActions, CTAButton };
export type * from './CTA.types';