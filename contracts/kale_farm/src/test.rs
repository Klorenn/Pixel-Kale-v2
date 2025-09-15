#![cfg(test)]
use crate::{KaleFarmContract, KaleFarmContractClient};
use soroban_sdk::{Env, Address, symbol_short};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmContract);
    let client = KaleFarmContractClient::new(&env, &contract_id);

    client.initialize();
    
    // Check that contract is initialized
    assert_eq!(client.get_farm_index(), 0);
    assert_eq!(client.get_total_kale(), 0);
}

#[test]
fn test_plant_work_harvest_cycle() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmContract);
    let client = KaleFarmContractClient::new(&env, &contract_id);

    // Initialize contract
    client.initialize();

    // Create a test farmer
    let farmer = Address::generate(&env);

    // Test plant
    let farm_index = client.plant(&farmer, &1000);
    assert_eq!(farm_index, 1);
    assert_eq!(client.get_farm_index(), 1);

    // Test work (simplified - in real implementation would need proper proof of work)
    let worked = client.work(&farmer, &12345, &3);
    assert!(worked);

    // Test harvest
    let reward = client.harvest(&farmer, &farm_index);
    assert!(reward > 0);

    // Check farmer's balance
    let balance = client.get_kale_balance(&farmer);
    assert_eq!(balance, reward);

    // Check total earned
    let total_earned = client.get_total_earned(&farmer);
    assert_eq!(total_earned, reward);
}

#[test]
fn test_multiple_farmers() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmContract);
    let client = KaleFarmContractClient::new(&env, &contract_id);

    client.initialize();

    let farmer1 = Address::generate(&env);
    let farmer2 = Address::generate(&env);

    // Farmer 1 plants
    let farm_index1 = client.plant(&farmer1, &500);
    assert_eq!(farm_index1, 1);

    // Farmer 2 plants
    let farm_index2 = client.plant(&farmer2, &1000);
    assert_eq!(farm_index2, 2);

    // Check total KALE
    let total_kale = client.get_total_kale();
    assert_eq!(total_kale, 1500);
}

#[test]
fn test_farmer_status() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmContract);
    let client = KaleFarmContractClient::new(&env, &contract_id);

    client.initialize();

    let farmer = Address::generate(&env);

    // Initially no farming session
    let (planted, worked, harvested) = client.get_farmer_status(&farmer);
    assert!(!planted);
    assert!(!worked);
    assert!(!harvested);

    // After planting
    client.plant(&farmer, &1000);
    let (planted, worked, harvested) = client.get_farmer_status(&farmer);
    assert!(planted);
    assert!(!worked);
    assert!(!harvested);

    // After working
    client.work(&farmer, &12345, &3);
    let (planted, worked, harvested) = client.get_farmer_status(&farmer);
    assert!(planted);
    assert!(worked);
    assert!(!harvested);

    // After harvesting
    client.harvest(&farmer, &1);
    let (planted, worked, harvested) = client.get_farmer_status(&farmer);
    assert!(planted);
    assert!(worked);
    assert!(harvested);
}
