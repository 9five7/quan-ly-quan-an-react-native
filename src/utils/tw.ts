// src/utils/tw.ts
import { create } from 'twrnc';

// Load config từ tailwind.config.js
const tw = create(require('../../tailwind.config.js'));

// Export các style dùng chung
export const styles = {
  container: tw`mx-auto px-4 max-w-7xl`,
  header: tw`text-2xl font-bold text-primary`,
};
export const darkModeAwareTw = (colorScheme: 'light' | 'dark') => {
  return (strings: TemplateStringsArray, ...values: any[]) => {
    const style = tw(strings, ...values);
    return colorScheme === 'dark' 
      ? { ...style, $dark: true } 
      : style;
  };
};
export default tw;