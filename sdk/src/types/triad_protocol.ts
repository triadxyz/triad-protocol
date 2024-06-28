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
      name: 'requestWithdrawNft'
      discriminator: [132, 52, 242, 121, 178, 147, 240, 223]
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
                kind: 'account'
                path: 'mint'
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 105, 110, 116]
              },
              {
                kind: 'arg'
                path: 'args.nft_name'
              }
            ]
          }
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
              name: 'requestWithdrawNftArgs'
            }
          }
        }
      ]
    },
    {
      name: 'stake'
      discriminator: [206, 176, 202, 18, 200, 209, 179, 108]
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
      name: 'withdrawNft'
      discriminator: [142, 181, 191, 149, 82, 175, 216, 100]
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
                kind: 'account'
                path: 'mint'
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 105, 110, 116]
              },
              {
                kind: 'arg'
                path: 'args.nft_name'
              }
            ]
          }
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
              name: 'withdrawNftArgs'
            }
          }
        }
      ]
    }
  ]
  accounts: [
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
      name: 'unauthorizedToDeleteProject'
      msg: 'Unauthorized to delete the project'
    },
    {
      code: 6001
      name: 'invalidShadowAccount'
      msg: 'Invalid shadow account'
    },
    {
      code: 6002
      name: 'invalidAccount'
      msg: 'Invalid account'
    },
    {
      code: 6003
      name: 'unauthorized'
      msg: 'Unauthorized access'
    },
    {
      code: 6004
      name: 'alphaVantageApiError'
      msg: 'Failed to get data from Vybe Network'
    },
    {
      code: 6005
      name: 'depositFailed'
      msg: 'Failed to deposit'
    },
    {
      code: 6006
      name: 'invalidOwnerAuthority'
      msg: 'Invalid Owner authority'
    },
    {
      code: 6007
      name: 'invalidPosition'
      msg: 'Invalid Position'
    },
    {
      code: 6008
      name: 'invalidTickerPosition'
      msg: 'Invalid Ticker position'
    },
    {
      code: 6009
      name: 'noFreePositionSlot'
      msg: 'No free position slot'
    },
    {
      code: 6010
      name: 'invalidMintAddress'
      msg: 'Invalid Mint address'
    },
    {
      code: 6011
      name: 'invalidProfitShare'
      msg: 'Invalid Profit Share'
    },
    {
      code: 6012
      name: 'invalidDepositAmount'
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6013
      name: 'invalidWithdrawAmount'
      msg: 'Invalid Withdraw Amount'
    },
    {
      code: 6014
      name: 'invalidStakeVault'
      msg: 'Invalid Stake Vault'
    },
    {
      code: 6015
      name: 'invalidStakeVaultAuthority'
      msg: 'Invalid Stake Vault Authority'
    },
    {
      code: 6016
      name: 'invalidStakeVaultAmount'
      msg: 'Invalid Stake Vault Amount'
    },
    {
      code: 6017
      name: 'stakeVaultLocked'
      msg: 'Stake Vault Available'
    },
    {
      code: 6018
      name: 'stakeLocked'
      msg: 'Stake is locked'
    },
    {
      code: 6019
      name: 'stakeVaultFull'
      msg: 'Stake Vault Full'
    }
  ]
  types: [
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
      name: 'requestWithdrawNftArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'stakeVault'
            type: 'string'
          },
          {
            name: 'nftName'
            type: 'string'
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
            name: 'apr'
            type: 'u8'
          },
          {
            name: 'amountUsers'
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
            name: 'usersPaid'
            type: 'pubkey'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 64]
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
            docs: ['timestamp of the creation of the ticker']
            type: 'i64'
          },
          {
            name: 'updatedTs'
            docs: ['timestamp of the last update of the ticker']
            type: 'i64'
          },
          {
            name: 'bump'
            docs: ['The bump for the ticker pda']
            type: 'u8'
          },
          {
            name: 'authority'
            docs: ['authority for the ticker']
            type: 'pubkey'
          },
          {
            name: 'name'
            docs: ['name of the ticekt']
            type: 'string'
          },
          {
            name: 'protocolProgramId'
            docs: [
              'protocol program id like dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH to get data info'
            ]
            type: 'pubkey'
          },
          {
            name: 'price'
            docs: ['ticker price']
            type: 'u64'
          },
          {
            name: 'vault'
            docs: ['Vault PDA']
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
      name: 'userPosition'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'ts'
            docs: ['timestamp']
            type: 'i64'
          },
          {
            name: 'bump'
            docs: ['bump seed']
            type: 'u8'
          },
          {
            name: 'totalDeposited'
            docs: ['total deposited']
            type: 'u64'
          },
          {
            name: 'totalWithdrawn'
            docs: ['total withdrawn']
            type: 'u64'
          },
          {
            name: 'lpShare'
            docs: ['total liquidity provided']
            type: 'u64'
          },
          {
            name: 'totalPositions'
            docs: ['total positions']
            type: 'u16'
          },
          {
            name: 'ticker'
            docs: ['ticker account']
            type: 'pubkey'
          },
          {
            name: 'authority'
            docs: ["user's authority"]
            type: 'pubkey'
          },
          {
            name: 'positions'
            docs: ["user's position"]
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
            docs: ['The bump for the vault pda']
            type: 'u8'
          },
          {
            name: 'authority'
            docs: ['authority for the vault']
            type: 'pubkey'
          },
          {
            name: 'name'
            docs: ['name of the vault']
            type: 'string'
          },
          {
            name: 'tokenAccount'
            docs: ['token account for the vault e.g. tDRIFT']
            type: 'pubkey'
          },
          {
            name: 'tickerAddress'
            docs: ['ticker address']
            type: 'pubkey'
          },
          {
            name: 'totalDeposited'
            docs: ['lifetime total deposited']
            type: 'u64'
          },
          {
            name: 'totalWithdrawn'
            docs: ['lifetime total withdrawn']
            type: 'u64'
          },
          {
            name: 'initTs'
            docs: ['timestamp vault initialized']
            type: 'i64'
          },
          {
            name: 'netDeposits'
            docs: ['lifetime net deposits']
            type: 'u128'
          },
          {
            name: 'netWithdraws'
            docs: ['lifetime net withdraws']
            type: 'u128'
          },
          {
            name: 'longBalance'
            docs: ['Long bet balance']
            type: 'u64'
          },
          {
            name: 'shortBalance'
            docs: ['Short bet balance']
            type: 'u64'
          },
          {
            name: 'longPositionsOpened'
            docs: ['Opened long positions']
            type: 'u64'
          },
          {
            name: 'shortPositionsOpened'
            docs: ['Opened short positions']
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'withdrawNftArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'stakeVault'
            type: 'string'
          },
          {
            name: 'nftName'
            type: 'string'
          }
        ]
      }
    }
  ]
}
