export default {
  async fetch(request, env) {
    // сначала пытаемся отдать статический файл
    return env.ASSETS.fetch(request);
  },
};
