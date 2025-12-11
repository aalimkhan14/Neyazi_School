const sequelize = require('./src/config'); // adjust path if needed

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Unable to connect:', err);
  }
})();
