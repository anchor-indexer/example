use crate::account::*;
use crate::event::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(init, payer =  authority, space = Counter::SIZE, seeds = [b"counter_v1".as_ref(), authority.to_account_info().key.as_ref()], bump)]
  pub counter: Loader<'info, Counter>,

  system_program: Program<'info, System>,

  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<Initialize>, bump: u8) -> ProgramResult {
  let counter = &mut ctx.accounts.counter.load_init()?;

  counter.authority = *ctx.accounts.authority.key;
  counter.count = 0;
  counter.bump = bump;

  emit!(InitializeCounterEvent {
    authority: counter.authority,
  });

  Ok(())
}
