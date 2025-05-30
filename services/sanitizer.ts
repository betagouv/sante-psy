import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

export const purifySanitizer = (value: string): string => DOMPurify.sanitize(value);

export default DOMPurify;
