use anchor_lang::prelude::*;

#[account(zero_copy)]
#[derive(PartialEq, Default, Debug)]
pub struct Counter {
  // 41
  pub authority: Pubkey, // 32
  pub count: u64,        // 8
  pub bump: u8,          // 1
}
