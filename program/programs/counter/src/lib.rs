// #region code
use anchor_lang::prelude::*;

#[program]
mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let counter = &mut ctx.accounts.counter;

        counter.authority = *ctx.accounts.authority.key;
        counter.count = 0;

        emit!(InitializeCounterEvent {
            authority: counter.authority,
        });

        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult{
        let counter = &mut ctx.accounts.counter;
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

    pub fn decrement(ctx: Context<Decrement>) -> ProgramResult{
        let counter = &mut ctx.accounts.counter;
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

    pub fn reset(ctx: Context<Reset>) -> ProgramResult{
        let counter = &mut ctx.accounts.counter;
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

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, associated = authority)]
    pub counter: ProgramAccount<'info, Counter>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, has_one = authority)]
    pub counter: ProgramAccount<'info, Counter>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut, has_one = authority)]
    pub counter: ProgramAccount<'info, Counter>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Reset<'info> {
    #[account(mut, has_one = authority)]
    pub counter: ProgramAccount<'info, Counter>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[associated]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
}

#[event]
pub struct InitializeCounterEvent {
    authority: Pubkey,
}

#[event]
pub struct IncrementCounterEvent {
    authority: Pubkey,
    count: u64,
}

#[event]
pub struct DecrementCounterEvent {
    authority: Pubkey,
    count: u64,
}

#[event]
pub struct ResetCounterEvent {
    authority: Pubkey,
}

#[error]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Counter is at zero")]
    ZeroCounter,
}