module.exports = () => {
  const cleanEnv = (process.env._ENV || '').trim().replace(/^['"]|['"]$/g, '');

  return {
    // 判断是否是本地环境
    isLocal() {
      return cleanEnv === "local";
    },
    isBeta() {
      return cleanEnv === "beta";
    },
    // 判断是否是生产环境
    isProd() {
      return cleanEnv === "prod";
    },
    // 获取当前环境
    get() {
      return cleanEnv || "local";
    },
  };
};
