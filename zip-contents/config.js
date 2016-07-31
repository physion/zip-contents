module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'development',
  RESOURCES_API_URL: process.env.RESOURCES_API_URL || '',
  SERVICES_API: process.env.SERVICES_API || 'https://services-staging.ovation.io',
}