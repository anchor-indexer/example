pub mod account;
pub mod error;
pub mod event;
pub mod instructions;
use anchor_lang::prelude::*;
use instructions::*;

declare_id!("CcXBZXzEMqrNfHx7CrLVEefiGrVrkZZxMgAr1DRaRsFz");

#[program]
mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> ProgramResult {
        initialize::handler(ctx, bump)
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        increment::handler(ctx)
    }

    pub fn decrement(ctx: Context<Decrement>) -> ProgramResult {
        decrement::handler(ctx)
    }

    pub fn reset(ctx: Context<Reset>) -> ProgramResult {
        reset::handler(ctx)
    }
}
