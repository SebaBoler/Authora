// import { customAlphabet } from 'nanoid';

let nanoid;

(async () => {
  const nanoidModule = await import('nanoid');
  nanoid = nanoidModule.customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-',
    16,
  );
})();

export { nanoid };

// export const nanoid = customAlphabet(
//   '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-',
//   16,
// );
