use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
  #[msg("You are not authorized to perform this action.")]
  Unauthorized,
  #[msg("Counter is at zero")]
  ZeroCounter,
}
