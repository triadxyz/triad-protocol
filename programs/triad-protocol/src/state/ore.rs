use num_enum::TryFromPrimitive;
use anchor_lang::prelude::*;
use bytemuck::{ Pod, Zeroable };

pub const PROOF: &[u8] = b"proof";

impl OreInstruction {
    pub fn to_vec(&self) -> Vec<u8> {
        vec![*self as u8]
    }
}

impl Open {
    pub fn to_bytes(&self) -> Vec<u8> {
        bytemuck::bytes_of(self).to_vec()
    }
}

impl MineInnerArgs {
    pub fn to_bytes(&self) -> Vec<u8> {
        bytemuck::bytes_of(self).to_vec()
    }
}

#[repr(u8)]
#[derive(Clone, Copy, Debug, Eq, PartialEq, TryFromPrimitive)]
#[rustfmt::skip]
pub enum OreInstruction {
 Claim = 0,
 Mine = 2,
 Open = 3,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Pod, Zeroable)]
pub struct Open {
    pub bump: u8,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Pod, Zeroable, serde::Serialize, serde::Deserialize)]
pub struct MineInnerArgs {
    pub digest: [u8; 16],
    pub nonce: [u8; 8],
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MineArgs {
    pub digest: [u8; 16],
    pub nonce: [u8; 8],
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Pod, Zeroable)]
pub struct ClaimArgs {
    pub amount: [u8; 8],
}
