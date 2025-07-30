/**
 * Power BI Setup Test Utility
 * Test script to validate Power BI configuration and connectivity
 */

import { 
  validatePowerBIConfig, 
  getPowerBIAccessToken, 
  getWorkspaceReports 
} from './powerbi';

async function testPowerBISetup() {
  console.log('🔍 Testing Power BI Embedded setup...\n');

  // Test 1: Validate environment variables
  console.log('1. Validating environment variables...');
  const configValid = validatePowerBIConfig();
  
  if (!configValid) {
    console.error('❌ Power BI configuration is invalid');
    console.log('Please check your environment variables:');
    console.log('- POWER_BI_CLIENT_ID');
    console.log('- POWER_BI_CLIENT_SECRET');
    return;
  }
  console.log('✅ Environment variables are configured');

  // Test 2: Get access token
  console.log('\n2. Testing authentication...');
  try {
    const accessToken = await getPowerBIAccessToken();
    console.log('✅ Successfully acquired access token');
    console.log(`Token preview: ${accessToken.substring(0, 20)}...`);
  } catch (error) {
    console.error('❌ Failed to acquire access token:', error);
    return;
  }

  // Test 3: List workspace reports (optional)
  console.log('\n3. Testing API connectivity...');
  try {
    const reports = await getWorkspaceReports();
    console.log(`✅ Successfully connected to Power BI API`);
    console.log(`Found ${reports.length} reports in default workspace`);
    
    if (reports.length > 0) {
      console.log('\nAvailable reports:');
      reports.forEach((report, index) => {
        console.log(`  ${index + 1}. ${report.name} (ID: ${report.id})`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to connect to Power BI API:', error);
    console.log('This might be due to:');
    console.log('- Service principal not added to workspace');
    console.log('- Insufficient permissions');
    console.log('- Power BI tenant settings');
    return;
  }

  console.log('\n🎉 Power BI Embedded setup is working correctly!');
  console.log('\nNext steps:');
  console.log('1. Use getEmbedToken() to generate embed tokens for specific reports');
  console.log('2. Use the PowerBIEmbed React component to display reports');
  console.log('3. Call /api/powerbi/embed-token API endpoint from your frontend');
}

// Export for use in scripts or API routes
export { testPowerBISetup };

// Run test if this file is executed directly
if (require.main === module) {
  testPowerBISetup().catch(console.error);
}
