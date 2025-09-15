// Generate New Launchtube Token
const fetch = require('node-fetch');

class LaunchtubeTokenGenerator {
    constructor() {
        this.testnetUrl = 'https://testnet.launchtube.xyz';
        this.mainnetUrl = 'https://launchtube.xyz';
    }

    // Generate token from testnet
    async generateTestnetToken() {
        console.log('🔑 Generating new Launchtube token from testnet...');
        try {
            const response = await fetch(`${this.testnetUrl}/gen`, {
                method: 'GET'
            });

            if (response.ok) {
                const tokens = await response.json();
                console.log('✅ Testnet token generated successfully!');
                console.log(`   Token: ${tokens[0]}`);
                console.log(`   URL: ${this.testnetUrl}/activate?token=${tokens[0]}`);
                return { success: true, token: tokens[0], url: `${this.testnetUrl}/activate?token=${tokens[0]}` };
            } else {
                const errorText = await response.text();
                console.log(`❌ Failed to generate testnet token: ${response.status} - ${errorText}`);
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.log(`❌ Error generating testnet token: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // Test token activation
    async testTokenActivation(token, network = 'testnet') {
        console.log(`🔓 Testing token activation on ${network}...`);
        try {
            const baseUrl = network === 'testnet' ? this.testnetUrl : this.mainnetUrl;
            
            const formData = new URLSearchParams();
            formData.append('token', token);

            const response = await fetch(`${baseUrl}/activate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            console.log(`   Response status: ${response.status}`);
            const responseText = await response.text();
            console.log(`   Response: ${responseText}`);

            if (response.ok) {
                console.log(`✅ Token activated successfully on ${network}!`);
                return { success: true, result: responseText };
            } else {
                console.log(`❌ Token activation failed on ${network}: ${response.status} - ${responseText}`);
                return { success: false, error: responseText };
            }
        } catch (error) {
            console.log(`❌ Token activation error on ${network}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // Test token info
    async testTokenInfo(token, network = 'testnet') {
        console.log(`🔍 Testing token info on ${network}...`);
        try {
            const baseUrl = network === 'testnet' ? this.testnetUrl : this.mainnetUrl;
            
            const response = await fetch(`${baseUrl}/info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.text();
                console.log(`✅ Token info on ${network}: ${result}`);
                return { success: true, result };
            } else {
                const errorText = await response.text();
                console.log(`❌ Token info failed on ${network}: ${response.status} - ${errorText}`);
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.log(`❌ Token info error on ${network}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // Test simple transaction
    async testSimpleTransaction(token, network = 'testnet') {
        console.log(`📝 Testing simple transaction on ${network}...`);
        try {
            const baseUrl = network === 'testnet' ? this.testnetUrl : this.mainnetUrl;
            
            // Create a simple test transaction XDR
            const testXdr = 'AAAAAgAAAAA=';
            
            const formData = new URLSearchParams();
            formData.append('xdr', testXdr);

            const response = await fetch(`${baseUrl}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            console.log(`   Response status: ${response.status}`);
            const responseText = await response.text();
            console.log(`   Response: ${responseText}`);

            if (response.ok) {
                console.log(`✅ Simple transaction successful on ${network}!`);
                return { success: true, result: responseText };
            } else {
                console.log(`❌ Simple transaction failed on ${network}: ${response.status} - ${responseText}`);
                return { success: false, error: responseText };
            }
        } catch (error) {
            console.log(`❌ Simple transaction error on ${network}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // Run complete token generation and test
    async runCompleteTest() {
        console.log('🚀 Starting Complete Launchtube Token Generation and Test');
        console.log('========================================================');
        console.log('');

        const results = {};

        // Step 1: Generate testnet token
        console.log('Step 1: Generate Testnet Token');
        console.log('-------------------------------');
        results.testnetToken = await this.generateTestnetToken();
        console.log('');

        if (results.testnetToken.success) {
            // Step 2: Test token activation
            console.log('Step 2: Test Token Activation');
            console.log('------------------------------');
            results.activation = await this.testTokenActivation(results.testnetToken.token, 'testnet');
            console.log('');

            // Step 3: Test token info
            console.log('Step 3: Test Token Info');
            console.log('------------------------');
            results.tokenInfo = await this.testTokenInfo(results.testnetToken.token, 'testnet');
            console.log('');

            // Step 4: Test simple transaction
            console.log('Step 4: Test Simple Transaction');
            console.log('-------------------------------');
            results.transaction = await this.testSimpleTransaction(results.testnetToken.token, 'testnet');
            console.log('');
        }

        // Summary
        console.log('📊 Test Summary');
        console.log('===============');
        Object.entries(results).forEach(([step, result]) => {
            const status = result.success ? '✅ PASS' : '❌ FAIL';
            console.log(`${step}: ${status}`);
            if (!result.success) {
                console.log(`   Error: ${result.error}`);
            }
        });

        if (results.testnetToken && results.testnetToken.success) {
            console.log('\n🎉 Token Generated Successfully!');
            console.log('================================');
            console.log(`Token: ${results.testnetToken.token}`);
            console.log(`Activation URL: ${results.testnetToken.url}`);
            console.log('\n📋 Next Steps:');
            console.log('1. Go to the activation URL above');
            console.log('2. Complete the activation process');
            console.log('3. Use the activated token in your tests');
            console.log('4. Start farming KALE!');
        }

        return results;
    }
}

// Run the complete test
async function main() {
    const generator = new LaunchtubeTokenGenerator();
    await generator.runCompleteTest();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = LaunchtubeTokenGenerator;
