pub mod account;
pub mod context;
pub mod error;
pub mod event;
use anchor_lang::prelude::*;
use context::*;
use error::*;
use event::*;

declare_id!("3eGGxWCo5t6we2cZXpoeEzDbrmbgJHVyjTASBrJKAmfp");

#[program]
mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> ProgramResult {
        let counter = &mut ctx.accounts.counter.load_init()?;

        counter.authority = *ctx.accounts.authority.key;
        counter.count = 0;
        counter.bump = bump;

        emit!(InitializeCounterEvent {
            authority: counter.authority,
        });

        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let counter = &mut ctx.accounts.counter.load_mut()?;
        if counter.authority != *ctx.accounts.authority.key {
            return Err(ErrorCode::Unauthorized.into());
        }
        counter.count += 1;

        emit!(IncrementCounterEvent {
            authority: counter.authority,
            count: counter.count,
        });

        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> ProgramResult {
        let counter = &mut ctx.accounts.counter.load_mut()?;
        if counter.authority != *ctx.accounts.authority.key {
            return Err(ErrorCode::Unauthorized.into());
        }
        if counter.count == 0 {
            return Err(ErrorCode::ZeroCounter.into());
        }
        counter.count -= 1;

        emit!(DecrementCounterEvent {
            authority: counter.authority,
            count: counter.count,
        });

        Ok(())
    }

    pub fn reset(ctx: Context<Reset>) -> ProgramResult {
        let counter = &mut ctx.accounts.counter.load_mut()?;
        if counter.authority != *ctx.accounts.authority.key {
            return Err(ErrorCode::Unauthorized.into());
        }

        counter.count = 0;

        emit!(ResetCounterEvent {
            authority: counter.authority,
        });

        Ok(())
    }
}
