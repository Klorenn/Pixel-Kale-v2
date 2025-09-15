#![no_std]
use soroban_sdk::{contract, contractimpl, log, symbol_short, Env, Symbol, Address, Map, Vec, String, u32, u64, i128, Val};

// Contract Data Keys
const COUNTER: Symbol = symbol_short!("COUNTER");
const FARMERS: Symbol = symbol_short!("FARMERS");
const KALE_BALANCE: Symbol = symbol_short!("KALE_BAL");
const FARM_INDEX: Symbol = symbol_short!("FARM_IDX");
const TOTAL_KALE: Symbol = symbol_short!("TOTAL_K");

// Farmer Data Structure
#[derive(Clone, Debug, PartialEq)]
pub struct Farmer {
    pub address: Address,
    pub kale_balance: i128,
    pub total_earned: i128,
    pub farm_index: u32,
    pub planted_at: u64,
    pub worked: bool,
    pub harvested: bool,
    pub nonce: u64,
    pub zeros: u32,
}

#[contract]
pub struct KaleFarmContract;

#[contractimpl]
impl KaleFarmContract {
    /// Initialize the contract
    pub fn initialize(env: &Env) {
        env.storage().instance().set(&COUNTER, &0u32);
        env.storage().instance().set(&FARM_INDEX, &0u32);
        env.storage().instance().set(&TOTAL_KALE, &0i128);
        env.storage().instance().extend_ttl(100, 100);
    }

    /// Plant KALE seeds (start farming session)
    pub fn plant(env: &Env, farmer: Address, stake_amount: i128) -> u32 {
        // Get current farm index
        let mut farm_index: u32 = env.storage().instance().get(&FARM_INDEX).unwrap_or(0);
        farm_index += 1;
        env.storage().instance().set(&FARM_INDEX, &farm_index);

        // Create farmer data
        let farmer_data = Farmer {
            address: farmer.clone(),
            kale_balance: 0i128,
            total_earned: 0i128,
            farm_index,
            planted_at: env.ledger().timestamp(),
            worked: false,
            harvested: false,
            nonce: 0,
            zeros: 0,
        };

        // Store farmer data
        let farmers_key = (FARMERS, farmer.clone());
        env.storage().instance().set(&farmers_key, &farmer_data);
        
        // Update total KALE
        let total_kale: i128 = env.storage().instance().get(&TOTAL_KALE).unwrap_or(0);
        env.storage().instance().set(&TOTAL_KALE, &(total_kale + stake_amount));

        // Extend TTL
        env.storage().instance().extend_ttl(100, 100);

        log!(&env, "Farmer planted KALE at farm index: {}", farm_index);
        farm_index
    }

    /// Work on the farm (proof of work)
    pub fn work(env: &Env, farmer: Address, nonce: u64, zeros: u32) -> bool {
        let farmers_key = (FARMERS, farmer.clone());
        let mut farmer_data: Farmer = env.storage().instance().get(&farmers_key)
            .expect("Farmer not found");

        if farmer_data.worked {
            return false; // Already worked
        }

        // Verify proof of work (simplified)
        let entropy = env.ledger().sequence_number();
        let hash = Self::generate_hash(farm_index, nonce, entropy, &farmer);
        let calculated_zeros = Self::count_leading_zeros(&hash);

        if calculated_zeros >= zeros {
            farmer_data.worked = true;
            farmer_data.nonce = nonce;
            farmer_data.zeros = zeros;
            
            env.storage().instance().set(&farmers_key, &farmer_data);
            env.storage().instance().extend_ttl(100, 100);

            log!(&env, "Farmer worked with {} zeros", zeros);
            true
        } else {
            false
        }
    }

    /// Harvest KALE (claim rewards)
    pub fn harvest(env: &Env, farmer: Address, farm_index: u32) -> i128 {
        let farmers_key = (FARMERS, farmer.clone());
        let mut farmer_data: Farmer = env.storage().instance().get(&farmers_key)
            .expect("Farmer not found");

        if farmer_data.harvested || !farmer_data.worked {
            return 0; // Cannot harvest
        }

        // Calculate reward based on work quality
        let base_reward = 1000i128; // Base KALE reward
        let zeros_bonus = (farmer_data.zeros as i128) * 100; // Bonus per zero
        let time_bonus = (env.ledger().timestamp() - farmer_data.planted_at) / 60; // 1 KALE per minute
        let total_reward = base_reward + zeros_bonus + (time_bonus as i128);

        // Update farmer data
        farmer_data.kale_balance += total_reward;
        farmer_data.total_earned += total_reward;
        farmer_data.harvested = true;

        env.storage().instance().set(&farmers_key, &farmer_data);
        env.storage().instance().extend_ttl(100, 100);

        log!(&env, "Farmer harvested {} KALE", total_reward);
        total_reward
    }

    /// Get farmer's KALE balance
    pub fn get_kale_balance(env: &Env, farmer: Address) -> i128 {
        let farmers_key = (FARMERS, farmer);
        let farmer_data: Farmer = env.storage().instance().get(&farmers_key)
            .unwrap_or(Farmer {
                address: farmer,
                kale_balance: 0,
                total_earned: 0,
                farm_index: 0,
                planted_at: 0,
                worked: false,
                harvested: false,
                nonce: 0,
                zeros: 0,
            });
        farmer_data.kale_balance
    }

    /// Get farmer's total earned KALE
    pub fn get_total_earned(env: &Env, farmer: Address) -> i128 {
        let farmers_key = (FARMERS, farmer);
        let farmer_data: Farmer = env.storage().instance().get(&farmers_key)
            .unwrap_or(Farmer {
                address: farmer,
                kale_balance: 0,
                total_earned: 0,
                farm_index: 0,
                planted_at: 0,
                worked: false,
                harvested: false,
                nonce: 0,
                zeros: 0,
            });
        farmer_data.total_earned
    }

    /// Get farmer's farming status
    pub fn get_farmer_status(env: &Env, farmer: Address) -> (bool, bool, bool) {
        let farmers_key = (FARMERS, farmer);
        let farmer_data: Farmer = env.storage().instance().get(&farmers_key)
            .unwrap_or(Farmer {
                address: farmer,
                kale_balance: 0,
                total_earned: 0,
                farm_index: 0,
                planted_at: 0,
                worked: false,
                harvested: false,
                nonce: 0,
                zeros: 0,
            });
        (farmer_data.planted_at > 0, farmer_data.worked, farmer_data.harvested)
    }

    /// Get total KALE in circulation
    pub fn get_total_kale(env: &Env) -> i128 {
        env.storage().instance().get(&TOTAL_KALE).unwrap_or(0)
    }

    /// Get current farm index
    pub fn get_farm_index(env: &Env) -> u32 {
        env.storage().instance().get(&FARM_INDEX).unwrap_or(0)
    }

    /// Helper function to generate hash for proof of work
    fn generate_hash(farm_index: u32, nonce: u64, entropy: u64, farmer: &Address) -> Vec<u8> {
        // Simplified hash generation for demo
        let mut data = Vec::new();
        data.push_back((farm_index >> 24) as u8);
        data.push_back((farm_index >> 16) as u8);
        data.push_back((farm_index >> 8) as u8);
        data.push_back(farm_index as u8);
        
        data.push_back((nonce >> 56) as u8);
        data.push_back((nonce >> 48) as u8);
        data.push_back((nonce >> 40) as u8);
        data.push_back((nonce >> 32) as u8);
        data.push_back((nonce >> 24) as u8);
        data.push_back((nonce >> 16) as u8);
        data.push_back((nonce >> 8) as u8);
        data.push_back(nonce as u8);
        
        // Add entropy
        data.push_back((entropy >> 56) as u8);
        data.push_back((entropy >> 48) as u8);
        data.push_back((entropy >> 40) as u8);
        data.push_back((entropy >> 32) as u8);
        data.push_back((entropy >> 24) as u8);
        data.push_back((entropy >> 16) as u8);
        data.push_back((entropy >> 8) as u8);
        data.push_back(entropy as u8);
        
        data
    }

    /// Helper function to count leading zeros
    fn count_leading_zeros(hash: &Vec<u8>) -> u32 {
        let mut zeros = 0u32;
        for &byte in hash.iter() {
            if byte == 0 {
                zeros += 2;
            } else if byte < 16 {
                zeros += 1;
                break;
            } else {
                break;
            }
        }
        zeros
    }
}

mod test;
