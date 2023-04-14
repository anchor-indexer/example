use anchor_lang::prelude::*;

#[account]
pub struct Counter {
  // 41
  pub authority: Pubkey, // 32
  pub count: u64,        // 8
  pub bump: u8,          // 1

}

impl Counter {
  pub const SIZE: usize = 8 + 32 + 8 + 1;
}