import { development } from './development';
import { production } from './production';

export const env = process.env.NODE_ENV === 'production' ? production : development;
