use anchor_lang::prelude::*;

#[event]
pub struct InitializeCounterEvent {
  pub authority: Pubkey,
}

#[event]
pub struct IncrementCounterEvent {
  pub authority: Pubkey,
}

#[event]
pub struct DecrementCounterEvent {
  pub authority: Pubkey,
}

#[event]
pub struct ResetCounterEvent {
  pub authority: Pubkey,
}
