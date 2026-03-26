const { Service } = require('./Models');
const ServiceModel = require('./Models/service.model');

async function check() {
  try {
    const services = await ServiceModel.findAll();
    console.log('Total services:', services.length);
    services.forEach(s => {
      console.log(`- ${s.name} (ID: ${s.id}, active: ${s.is_active})`);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
