pub mod account;
pub mod error;
pub mod event;
pub mod instructions;
use anchor_lang::prelude::*;
use instructions::*;

declare_id!("GqbUWMWQpgGMprXUEPkxuifKGZidL1CxxFkbqBgVqcDV");

#[program]
mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
        initialize::handler(ctx, bump)
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        increment::handler(ctx)
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        decrement::handler(ctx)
    }

    pub fn reset(ctx: Context<Reset>) -> Result<()> {
        reset::handler(ctx)
    }
}
