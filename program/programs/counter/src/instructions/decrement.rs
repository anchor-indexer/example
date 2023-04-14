use crate::account::*;
use crate::error::*;
use crate::event::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Decrement<'info> {
  #[account(mut, seeds = [b"counter_v1".as_ref(), authority.to_account_info().key.as_ref()], bump = counter.bump)]
  pub counter: Account<'info, Counter>,

  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<Decrement>) -> Result<()> {
  let counter = &mut ctx.accounts.counter;
  if counter.authority != *ctx.accounts.authority.key {
    return Err(Errors::Unauthorized.into());
  }
  if counter.count == 0 {
    return Err(Errors::ZeroCounter.into());
  }
  counter.count -= 1;

  emit!(DecrementCounterEvent {
    authority: counter.authority,
  });

  Ok(())
}
