module.exports = {
  port: process.env.PORT || 3001,
  db:
    process.env.MONGODB ||
    "mongodb://gaia-ansu-sergio:Desarrollador18@ds223253.mlab.com:23253/buildy",
  SECRET_TOKEN: "dci.buildy.token"
};
