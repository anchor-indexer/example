use anchor_lang::prelude::*;

#[event]
pub struct InitializeCounterEvent {
  pub authority: Pubkey,
}

#[event]
pub struct IncrementCounterEvent {
  pub authority: Pubkey,
  pub count: u64,
}

#[event]
pub struct DecrementCounterEvent {
  pub authority: Pubkey,
  pub count: u64,
}

#[event]
pub struct ResetCounterEvent {
  pub authority: Pubkey,
}
