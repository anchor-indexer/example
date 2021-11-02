use crate::account::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
  #[account(init, payer =  authority, space = 8 + 41, seeds = [b"counter_v1".as_ref(), authority.to_account_info().key.as_ref()], bump = bump)]
  pub counter: Loader<'info, Counter>,

  rent: Sysvar<'info, Rent>,
  system_program: AccountInfo<'info>,

  #[account(mut)]
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
  #[account(mut, seeds = [b"counter_v1".as_ref(), authority.to_account_info().key.as_ref()], bump = counter.load()?.bump)]
  pub counter: Loader<'info, Counter>,

  #[account(mut)]
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
  #[account(mut, seeds = [b"counter_v1".as_ref(), authority.to_account_info().key.as_ref()], bump = counter.load()?.bump)]
  pub counter: Loader<'info, Counter>,

  #[account(mut)]
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Reset<'info> {
  #[account(mut, seeds = [b"counter_v1".as_ref(), authority.to_account_info().key.as_ref()], bump = counter.load()?.bump)]
  pub counter: Loader<'info, Counter>,

  #[account(mut)]
  pub authority: Signer<'info>,
}
