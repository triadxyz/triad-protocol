/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/triad_protocol.json`.
 */
export type TriadProtocol = {
  address: 'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss'
  metadata: {
    name: 'triadProtocol'
    version: '0.1.0'
    spec: '0.1.0'
  }
  instructions: [
    {
      name: 'claimRewards'
      discriminator: [4, 144, 132, 71, 116, 23, 151, 80]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
        },
        {
          name: 'stake'
          writable: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'fromAta'
          writable: true
        },
        {
          name: 'toAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'claimStakeRewards'
      discriminator: [107, 91, 233, 196, 211, 47, 218, 21]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
        },
        {
          name: 'stake'
          writable: true
        },
        {
          name: 'nftRewards'
          writable: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'fromAta'
          writable: true
        },
        {
          name: 'toAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'claimStakeRewardsArgs'
            }
          }
        }
      ]
    },
    {
      name: 'closePosition'
      discriminator: [123, 134, 81, 0, 49, 68, 98, 98]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'ticker'
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'userPosition'
          writable: true
        },
        {
          name: 'vaultTokenAccount'
          writable: true
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'closePositionArgs'
            }
          }
        }
      ]
    },
    {
      name: 'createTicker'
      discriminator: [32, 213, 147, 234, 14, 160, 57, 17]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'ticker'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [116, 105, 99, 107, 101, 114]
              },
              {
                kind: 'arg'
                path: 'args.name'
              }
            ]
          }
        },
        {
          name: 'vault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116]
              },
              {
                kind: 'account'
                path: 'ticker'
              }
            ]
          }
        },
        {
          name: 'payerTokenMint'
        },
        {
          name: 'tokenAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                kind: 'account'
                path: 'vault'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'createTickerArgs'
            }
          }
        }
      ]
    },
    {
      name: 'createUser'
      discriminator: [108, 227, 130, 130, 252, 109, 75, 218]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'referral'
          writable: true
        },
        {
          name: 'user'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114]
              },
              {
                kind: 'arg'
                path: 'args.name'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'createUserArgs'
            }
          }
        }
      ]
    },
    {
      name: 'createUserPosition'
      discriminator: [6, 137, 127, 227, 135, 241, 14, 109]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'ticker'
          writable: true
        },
        {
          name: 'userPosition'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'ticker'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'depositStakeRewards'
      discriminator: [59, 201, 204, 3, 44, 75, 231, 129]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101, 95, 118, 97, 117, 108, 116]
              },
              {
                kind: 'arg'
                path: 'args.stake_vault'
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'fromAta'
          writable: true
        },
        {
          name: 'toAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'depositStakeRewardsArgs'
            }
          }
        }
      ]
    },
    {
      name: 'initializeStakeVault'
      discriminator: [125, 55, 104, 34, 35, 179, 67, 3]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101, 95, 118, 97, 117, 108, 116]
              },
              {
                kind: 'arg'
                path: 'args.name'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'initializeStakeVaultArgs'
            }
          }
        }
      ]
    },
    {
      name: 'openPosition'
      discriminator: [135, 128, 47, 77, 15, 152, 240, 49]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'ticker'
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'userPosition'
          writable: true
        },
        {
          name: 'vaultTokenAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                kind: 'account'
                path: 'vault'
              }
            ]
          }
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'openPositionArgs'
            }
          }
        }
      ]
    },
    {
      name: 'requestWithdrawStake'
      discriminator: [175, 9, 77, 31, 145, 136, 30, 207]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
        },
        {
          name: 'stake'
          writable: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'stakeNft'
      discriminator: [38, 27, 66, 46, 69, 65, 151, 219]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101, 95, 118, 97, 117, 108, 116]
              },
              {
                kind: 'arg'
                path: 'args.stake_vault'
              }
            ]
          }
        },
        {
          name: 'stake'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101]
              },
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'arg'
                path: 'args.name'
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'fromAta'
          writable: true
        },
        {
          name: 'toAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'stakeNftArgs'
            }
          }
        }
      ]
    },
    {
      name: 'stakeToken'
      discriminator: [191, 127, 193, 101, 37, 96, 87, 211]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101, 95, 118, 97, 117, 108, 116]
              },
              {
                kind: 'arg'
                path: 'args.stake_vault'
              }
            ]
          }
        },
        {
          name: 'stake'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101]
              },
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'arg'
                path: 'args.name'
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'fromAta'
          writable: true
        },
        {
          name: 'toAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'stakeTokenArgs'
            }
          }
        }
      ]
    },
    {
      name: 'updateStakeRewards'
      discriminator: [39, 82, 38, 43, 234, 67, 69, 94]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stake'
          writable: true
        },
        {
          name: 'nftRewards'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [110, 102, 116, 95, 114, 101, 119, 97, 114, 100, 115]
              },
              {
                kind: 'account'
                path: 'stake'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'updateStakeRewardsArgs'
            }
          }
        }
      ]
    },
    {
      name: 'updateStakeVaultStatus'
      discriminator: [71, 64, 188, 150, 86, 254, 221, 65]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'updateStakeVaultStatusArgs'
            }
          }
        }
      ]
    },
    {
      name: 'updateTickerPrice'
      discriminator: [203, 166, 139, 83, 76, 144, 250, 29]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'ticker'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'updateTickerPriceArgs'
            }
          }
        }
      ]
    },
    {
      name: 'withdrawStake'
      discriminator: [153, 8, 22, 138, 105, 176, 87, 66]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'stakeVault'
          writable: true
        },
        {
          name: 'stake'
          writable: true
        },
        {
          name: 'admin'
          writable: true
        },
        {
          name: 'nftRewards'
          writable: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'fromAta'
          writable: true
        },
        {
          name: 'toAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    }
  ]
  accounts: [
    {
      name: 'nftRewards'
      discriminator: [210, 99, 18, 65, 58, 128, 167, 91]
    },
    {
      name: 'stake'
      discriminator: [150, 197, 176, 29, 55, 132, 112, 149]
    },
    {
      name: 'stakeVault'
      discriminator: [192, 112, 65, 125, 129, 151, 173, 226]
    },
    {
      name: 'ticker'
      discriminator: [214, 74, 184, 188, 214, 64, 251, 53]
    },
    {
      name: 'user'
      discriminator: [159, 117, 95, 227, 239, 151, 58, 236]
    },
    {
      name: 'userPosition'
      discriminator: [251, 248, 209, 245, 83, 234, 17, 27]
    },
    {
      name: 'vault'
      discriminator: [211, 8, 232, 43, 2, 152, 117, 119]
    }
  ]
  events: [
    {
      name: 'closePositionRecord'
      discriminator: [202, 208, 157, 166, 193, 229, 76, 5]
    },
    {
      name: 'openPositionRecord'
      discriminator: [118, 71, 105, 89, 222, 111, 56, 63]
    },
    {
      name: 'tickerPriceUpdateRecord'
      discriminator: [11, 38, 250, 234, 149, 218, 144, 15]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'invalidAccount'
      msg: 'Invalid account'
    },
    {
      code: 6001
      name: 'unauthorized'
      msg: 'Unauthorized access'
    },
    {
      code: 6002
      name: 'depositFailed'
      msg: 'Failed to deposit'
    },
    {
      code: 6003
      name: 'invalidOwnerAuthority'
      msg: 'Invalid owner authority'
    },
    {
      code: 6004
      name: 'invalidPosition'
      msg: 'Invalid position'
    },
    {
      code: 6005
      name: 'invalidTickerPosition'
      msg: 'Invalid ticker position'
    },
    {
      code: 6006
      name: 'noFreePositionSlot'
      msg: 'No free position slot'
    },
    {
      code: 6007
      name: 'invalidMintAddress'
      msg: 'Invalid mint address'
    },
    {
      code: 6008
      name: 'invalidProfitShare'
      msg: 'Invalid profit share'
    },
    {
      code: 6009
      name: 'invalidDepositAmount'
      msg: 'Invalid deposit amount'
    },
    {
      code: 6010
      name: 'invalidWithdrawAmount'
      msg: 'Invalid withdraw amount'
    },
    {
      code: 6011
      name: 'invalidStakeVault'
      msg: 'Invalid stake vault'
    },
    {
      code: 6012
      name: 'invalidStakeVaultAuthority'
      msg: 'Invalid stake vault authority'
    },
    {
      code: 6013
      name: 'invalidStakeVaultAmount'
      msg: 'Invalid stake vault amount'
    },
    {
      code: 6014
      name: 'stakeVaultLocked'
      msg: 'Stake vault locked'
    },
    {
      code: 6015
      name: 'stakeLocked'
      msg: 'Stake is locked'
    },
    {
      code: 6016
      name: 'stakeVaultFull'
      msg: 'Stake vault full'
    },
    {
      code: 6017
      name: 'invalidMint'
      msg: 'Invalid mint'
    },
    {
      code: 6018
      name: 'invalidStakeVaultWeek'
      msg: 'Invalid stake vault week'
    },
    {
      code: 6019
      name: 'rewardsAlreadyClaimed'
      msg: 'Rewards already claimed'
    }
  ]
  types: [
    {
      name: 'claimStakeRewardsArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'week'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'closePositionArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'positionIndex'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'closePositionRecord'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'ticker'
            type: 'pubkey'
          },
          {
            name: 'closePrice'
            type: 'u64'
          },
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'isLong'
            type: 'bool'
          },
          {
            name: 'pnl'
            type: 'i64'
          },
          {
            name: 'user'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'collection'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'coleta'
          },
          {
            name: 'undead'
          },
          {
            name: 'alligators'
          },
          {
            name: 'pyth'
          }
        ]
      }
    },
    {
      name: 'createTickerArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'protocolProgramId'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'createUserArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'depositStakeRewardsArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'stakeVault'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'initializeStakeVaultArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'slots'
            type: 'u64'
          },
          {
            name: 'collection'
            type: 'string'
          },
          {
            name: 'amount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'nftRewards'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'stake'
            type: 'pubkey'
          },
          {
            name: 'dailyRewards'
            type: {
              array: ['u64', 30]
            }
          },
          {
            name: 'weeklyRewardsPaid'
            type: {
              array: ['bool', 5]
            }
          },
          {
            name: 'apr'
            type: 'f32'
          }
        ]
      }
    },
    {
      name: 'openPositionArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'isLong'
            type: 'bool'
          }
        ]
      }
    },
    {
      name: 'openPositionRecord'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'ticker'
            type: 'pubkey'
          },
          {
            name: 'entryPrice'
            type: 'u64'
          },
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'isLong'
            type: 'bool'
          },
          {
            name: 'user'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'position'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'entryPrice'
            type: 'u64'
          },
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'isLong'
            type: 'bool'
          },
          {
            name: 'isOpen'
            type: 'bool'
          },
          {
            name: 'pnl'
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'rarity'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'common'
          },
          {
            name: 'uncommon'
          },
          {
            name: 'rare'
          },
          {
            name: 'epic'
          },
          {
            name: 'legendary'
          },
          {
            name: 'mythic'
          }
        ]
      }
    },
    {
      name: 'stake'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'initTs'
            type: 'i64'
          },
          {
            name: 'isLocked'
            type: 'bool'
          },
          {
            name: 'withdrawTs'
            type: 'i64'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'collections'
            type: {
              vec: {
                defined: {
                  name: 'collection'
                }
              }
            }
          },
          {
            name: 'rarity'
            type: {
              defined: {
                name: 'rarity'
              }
            }
          },
          {
            name: 'mint'
            type: 'pubkey'
          },
          {
            name: 'stakeVault'
            type: 'pubkey'
          },
          {
            name: 'stakeRewards'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'stakeNftArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'rarity'
            type: {
              defined: {
                name: 'rarity'
              }
            }
          },
          {
            name: 'stakeVault'
            type: 'string'
          },
          {
            name: 'collections'
            type: {
              vec: {
                defined: {
                  name: 'collection'
                }
              }
            }
          }
        ]
      }
    },
    {
      name: 'stakeTokenArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'stakeVault'
            type: 'string'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'amount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'stakeVault'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'initTs'
            type: 'i64'
          },
          {
            name: 'endTs'
            type: 'i64'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'amountPaid'
            type: 'u64'
          },
          {
            name: 'tokenDecimals'
            type: 'u8'
          },
          {
            name: 'nftStaked'
            type: 'u64'
          },
          {
            name: 'slots'
            type: 'u64'
          },
          {
            name: 'isLocked'
            type: 'bool'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'collection'
            type: 'string'
          },
          {
            name: 'tokenMint'
            type: 'pubkey'
          },
          {
            name: 'week'
            type: 'u8'
          },
          {
            name: 'tokenStaked'
            type: 'u64'
          },
          {
            name: 'sumAllUsers'
            type: 'f64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 32]
            }
          }
        ]
      }
    },
    {
      name: 'ticker'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'initTs'
            type: 'i64'
          },
          {
            name: 'updatedTs'
            type: 'i64'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'protocolProgramId'
            type: 'pubkey'
          },
          {
            name: 'price'
            type: 'u64'
          },
          {
            name: 'vault'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'tickerPriceUpdateRecord'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'price'
            type: 'u64'
          },
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'ticker'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'updateStakeRewardsArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'day'
            type: 'u8'
          },
          {
            name: 'rewards'
            type: 'u64'
          },
          {
            name: 'apr'
            type: 'f32'
          }
        ]
      }
    },
    {
      name: 'updateStakeVaultStatusArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'isLocked'
            type: 'bool'
          },
          {
            name: 'week'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'updateTickerPriceArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'price'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'user'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'referral'
            type: 'pubkey'
          },
          {
            name: 'referred'
            type: 'i64'
          },
          {
            name: 'name'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'userPosition'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'totalDeposited'
            type: 'u64'
          },
          {
            name: 'totalWithdrawn'
            type: 'u64'
          },
          {
            name: 'lpShare'
            type: 'u64'
          },
          {
            name: 'totalPositions'
            type: 'u16'
          },
          {
            name: 'ticker'
            type: 'pubkey'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'positions'
            type: {
              array: [
                {
                  defined: {
                    name: 'position'
                  }
                },
                3
              ]
            }
          }
        ]
      }
    },
    {
      name: 'vault'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'tokenAccount'
            type: 'pubkey'
          },
          {
            name: 'tickerAddress'
            type: 'pubkey'
          },
          {
            name: 'totalDeposited'
            type: 'u64'
          },
          {
            name: 'totalWithdrawn'
            type: 'u64'
          },
          {
            name: 'initTs'
            type: 'i64'
          },
          {
            name: 'netDeposits'
            type: 'u128'
          },
          {
            name: 'netWithdraws'
            type: 'u128'
          },
          {
            name: 'longBalance'
            type: 'u64'
          },
          {
            name: 'shortBalance'
            type: 'u64'
          },
          {
            name: 'longPositionsOpened'
            type: 'u64'
          },
          {
            name: 'shortPositionsOpened'
            type: 'u64'
          }
        ]
      }
    }
  ]
}
