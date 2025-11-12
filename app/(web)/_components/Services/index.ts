import { ServicesMain } from './ServicesMain';
import { ServicesTitle } from './ServicesTitle';
import { ServicesBody } from './ServicesBody';
import { ServicesItems } from './ServicesItems';
import { ServicesItem } from './ServicesItem';

// Create compound component
const ServicesCompound = ServicesMain as typeof ServicesMain & {
  Title: typeof ServicesTitle;
  Body: typeof ServicesBody;
  Items: typeof ServicesItems;
  Item: typeof ServicesItem;
};

// Attach sub-components
ServicesCompound.Title = ServicesTitle;
ServicesCompound.Body = ServicesBody;
ServicesCompound.Items = ServicesItems;
ServicesCompound.Item = ServicesItem;

export { ServicesCompound as Services };
export { ServicesTitle, ServicesBody, ServicesItems, ServicesItem };
export type * from './Services.types';