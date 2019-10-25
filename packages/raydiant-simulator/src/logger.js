export default {
  warning(message) {
    console.log(`⚠️%c${message}`, 'color:#f8b91c');
  },

  pending(message) {
    console.log(`⬜️%c${message}`, 'color:#a5a5a5');
  },

  success(message) {
    console.log(`✅%c${message}`, 'color:#41984d');
  },
};
