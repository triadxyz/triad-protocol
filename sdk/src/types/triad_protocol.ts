/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/triad_protocol.json`.
 */
export type TriadProtocol = {
  address: '7nGGR51pBSUrpMPYVf9LWnNwaApz7N9VaJfDAJrihXts'
  metadata: {
    name: 'triadProtocol'
    version: '0.1.4'
    spec: '0.1.0'
    description: 'Triad protocol, trade solana projects'
  }
  instructions: [
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
          name: 'verifier'
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
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'stakeVault'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'toAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
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
              name: 'claimStakeRewardsArgs'
            }
          }
        }
      ]
      returns: 'u64'
    },
    {
      name: 'closeOrder'
      discriminator: [90, 103, 209, 28, 7, 63, 168, 4]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'userTrade'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 116, 114, 97, 100, 101]
              },
              {
                kind: 'account'
                path: 'signer'
              }
            ]
          }
        },
        {
          name: 'market'
          writable: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'userAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'marketVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'market'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
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
          name: 'orderId'
          type: 'u64'
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
          name: 'payer'
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
                kind: 'account'
                path: 'signer'
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
      name: 'createUserTrade'
      discriminator: [232, 235, 58, 194, 135, 248, 153, 1]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'userTrade'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 116, 114, 97, 100, 101]
              },
              {
                kind: 'account'
                path: 'signer'
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
      name: 'initializeMarket'
      discriminator: [35, 35, 189, 193, 155, 48, 170, 203]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'market'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 97, 114, 107, 101, 116]
              },
              {
                kind: 'arg'
                path: 'args.market_id'
              }
            ]
          }
        },
        {
          name: 'feeVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [102, 101, 101, 95, 118, 97, 117, 108, 116]
              },
              {
                kind: 'account'
                path: 'market'
              }
            ]
          }
        },
        {
          name: 'feeVaultAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'feeVault'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
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
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'initializeMarketArgs'
            }
          }
        }
      ]
    },
    {
      name: 'openOrder'
      discriminator: [206, 88, 88, 143, 38, 136, 50, 224]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'userTrade'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 116, 114, 97, 100, 101]
              },
              {
                kind: 'account'
                path: 'signer'
              }
            ]
          }
        },
        {
          name: 'market'
          writable: true
        },
        {
          name: 'feeVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [102, 101, 101, 95, 118, 97, 117, 108, 116]
              },
              {
                kind: 'account'
                path: 'market'
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'userFromAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'marketToAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'market'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'feeAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'feeVault'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
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
              name: 'openOrderArgs'
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
          name: 'user'
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
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'toAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'stakeVault'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
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
          name: 'user'
          writable: true
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
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'toAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'stakeVault'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
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
              name: 'stakeTokenArgs'
            }
          }
        }
      ]
    },
    {
      name: 'updateStakeBoost'
      discriminator: [239, 85, 19, 140, 235, 236, 88, 70]
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'updateStakeVault'
      discriminator: [84, 171, 100, 153, 126, 215, 229, 68]
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
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'toAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'stakeVault'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
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
              name: 'updateStakeVaultArgs'
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
          name: 'user'
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
          name: 'mint'
          writable: true
        },
        {
          name: 'fromAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'stakeVault'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'toAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
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
      args: []
    }
  ]
  accounts: [
    {
      name: 'feeVault'
      discriminator: [192, 178, 69, 232, 58, 149, 157, 132]
    },
    {
      name: 'market'
      discriminator: [219, 190, 213, 55, 0, 227, 198, 154]
    },
    {
      name: 'stakeV2'
      discriminator: [207, 98, 130, 13, 118, 181, 238, 47]
    },
    {
      name: 'stakeVault'
      discriminator: [192, 112, 65, 125, 129, 151, 173, 226]
    },
    {
      name: 'user'
      discriminator: [159, 117, 95, 227, 239, 151, 58, 236]
    },
    {
      name: 'userTrade'
      discriminator: [149, 190, 47, 218, 136, 9, 222, 222]
    }
  ]
  events: [
    {
      name: 'orderUpdate'
      discriminator: [97, 239, 148, 96, 83, 234, 245, 14]
    },
    {
      name: 'priceUpdate'
      discriminator: [222, 51, 180, 226, 165, 188, 203, 54]
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
    },
    {
      code: 6020
      name: 'stakeOverflow'
      msg: 'Stake overflow'
    },
    {
      code: 6021
      name: 'swapsReachedLimit'
      msg: 'Swaps reached limit'
    },
    {
      code: 6022
      name: 'insufficientFunds'
      msg: 'Insufficient funds'
    },
    {
      code: 6023
      name: 'noRewardsAvailable'
      msg: 'No rewards available'
    },
    {
      code: 6024
      name: 'invalidPrice'
      msg: 'Invalid price'
    },
    {
      code: 6025
      name: 'invalidOrderSize'
      msg: 'Invalid order size'
    },
    {
      code: 6026
      name: 'maxOpenOrdersReached'
      msg: 'Maximum number of open orders reached'
    },
    {
      code: 6027
      name: 'noAvailableOrderSlot'
      msg: 'No available order slot'
    },
    {
      code: 6028
      name: 'marketInactive'
      msg: 'Market is inactive'
    },
    {
      code: 6029
      name: 'invalidOrderType'
      msg: 'Invalid order type'
    },
    {
      code: 6030
      name: 'invalidOrderDirection'
      msg: 'Invalid order direction'
    },
    {
      code: 6031
      name: 'orderNotFound'
      msg: 'Order not found'
    },
    {
      code: 6032
      name: 'invalidOrderStatus'
      msg: 'Invalid order status'
    },
    {
      code: 6033
      name: 'arithmeticOverflow'
      msg: 'Arithmetic overflow'
    },
    {
      code: 6034
      name: 'orderSizeTooLarge'
      msg: 'Order size too large'
    }
  ]
  types: [
    {
      name: 'claimStakeRewardsArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'rank'
            type: 'u16'
          },
          {
            name: 'collections'
            type: 'u8'
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
      name: 'feeVault'
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
            name: 'market'
            type: 'pubkey'
          },
          {
            name: 'deposited'
            type: 'u64'
          },
          {
            name: 'withdrawn'
            type: 'u64'
          },
          {
            name: 'netBalance'
            type: 'u64'
          },
          {
            name: 'projectAvailable'
            type: 'u64'
          },
          {
            name: 'projectClaimed'
            type: 'u64'
          },
          {
            name: 'nftHoldersAvailable'
            type: 'u64'
          },
          {
            name: 'nftHoldersClaimed'
            type: 'u64'
          },
          {
            name: 'marketAvailable'
            type: 'u64'
          },
          {
            name: 'marketClaimed'
            type: 'u64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 56]
            }
          }
        ]
      }
    },
    {
      name: 'initializeMarketArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'marketId'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'market'
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
            name: 'marketId'
            docs: ['Unique identifier for the market']
            type: 'u64'
          },
          {
            name: 'name'
            docs: ['The event being predicted (e.g., "tJUP/TRD")']
            type: 'string'
          },
          {
            name: 'hypePrice'
            docs: [
              'Current price for Hype outcome (0-1000000, representing 0 to 1 TRD)',
              '1000000 = 1 TRD, 500000 = 0.5 TRD, etc.'
            ]
            type: 'u64'
          },
          {
            name: 'flopPrice'
            docs: [
              'Current price for Flop outcome (0-1000000, representing 0 to 1 TRD)'
            ]
            type: 'u64'
          },
          {
            name: 'hypeLiquidity'
            docs: ['Total liquidity for Hype (in TRD)']
            type: 'u64'
          },
          {
            name: 'flopLiquidity'
            docs: ['Total liquidity for Flop (in TRD)']
            type: 'u64'
          },
          {
            name: 'totalHypeShares'
            docs: ['Total number of Hype shares issued']
            type: 'u64'
          },
          {
            name: 'totalFlopShares'
            docs: ['Total number of Flop shares issued']
            type: 'u64'
          },
          {
            name: 'totalVolume'
            docs: ['Total trading volume (in TRD)']
            type: 'u64'
          },
          {
            name: 'mint'
            docs: ['Mint $TRD token']
            type: 'pubkey'
          },
          {
            name: 'ts'
            docs: ['Timestamp of the init']
            type: 'i64'
          },
          {
            name: 'updateTs'
            type: 'i64'
          },
          {
            name: 'openOrdersCount'
            docs: ['Total number of open orders in this market']
            type: 'u64'
          },
          {
            name: 'nextOrderId'
            docs: ['Next available order ID']
            type: 'u64'
          },
          {
            name: 'feeBps'
            docs: [
              'Fees applied to trades (in basis points, e.g., 300 = 3%) but 2.869 for the protocol; 0.1 NFT Holders; 0.031 Market'
            ]
            type: 'u16'
          },
          {
            name: 'feeVault'
            docs: ['Vault to Receive fees']
            type: 'pubkey'
          },
          {
            name: 'isActive'
            docs: ['Whether the market is currently active for trading']
            type: 'bool'
          },
          {
            name: 'isOfficial'
            type: 'bool'
          },
          {
            name: 'marketPrice'
            type: 'u64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 224]
            }
          }
        ]
      }
    },
    {
      name: 'openOrderArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'direction'
            type: {
              defined: {
                name: 'orderDirection'
              }
            }
          },
          {
            name: 'orderType'
            type: {
              defined: {
                name: 'orderType'
              }
            }
          },
          {
            name: 'limitPrice'
            type: {
              option: 'u64'
            }
          },
          {
            name: 'comment'
            type: {
              option: {
                array: ['u8', 64]
              }
            }
          }
        ]
      }
    },
    {
      name: 'order'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'orderId'
            type: 'u64'
          },
          {
            name: 'marketId'
            type: 'u64'
          },
          {
            name: 'status'
            type: {
              defined: {
                name: 'orderStatus'
              }
            }
          },
          {
            name: 'price'
            docs: [
              'The price of the order (in TRD)',
              'precision: PRICE_PRECISION (e.g., 1_000_000 = 1 TRD)'
            ]
            type: 'u64'
          },
          {
            name: 'totalAmount'
            docs: [
              'The total amount of TRD committed to this order',
              'precision: QUOTE_PRECISION'
            ]
            type: 'u64'
          },
          {
            name: 'totalShares'
            docs: ['The total number of shares to be purchased']
            type: 'u64'
          },
          {
            name: 'filledAmount'
            docs: [
              'The amount of TRD that has been filled',
              'precision: QUOTE_PRECISION'
            ]
            type: 'u64'
          },
          {
            name: 'filledShares'
            docs: ['The number of shares that have been filled']
            type: 'u64'
          },
          {
            name: 'orderType'
            type: {
              defined: {
                name: 'orderType'
              }
            }
          },
          {
            name: 'direction'
            type: {
              defined: {
                name: 'orderDirection'
              }
            }
          },
          {
            name: 'settledPnl'
            docs: [
              'The amount of pnl settled in this market since opening the position (in TRD)',
              'precision: QUOTE_PRECISION'
            ]
            type: 'i64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 16]
            }
          }
        ]
      }
    },
    {
      name: 'orderDirection'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'hype'
          },
          {
            name: 'flop'
          }
        ]
      }
    },
    {
      name: 'orderStatus'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'init'
          },
          {
            name: 'open'
          },
          {
            name: 'filled'
          },
          {
            name: 'canceled'
          },
          {
            name: 'closed'
          }
        ]
      }
    },
    {
      name: 'orderType'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'limit'
          },
          {
            name: 'market'
          }
        ]
      }
    },
    {
      name: 'orderUpdate'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'user'
            type: 'pubkey'
          },
          {
            name: 'marketId'
            type: 'u64'
          },
          {
            name: 'orderId'
            type: 'u64'
          },
          {
            name: 'direction'
            type: {
              defined: {
                name: 'orderDirection'
              }
            }
          },
          {
            name: 'orderType'
            type: {
              defined: {
                name: 'orderType'
              }
            }
          },
          {
            name: 'orderStatus'
            type: {
              defined: {
                name: 'orderStatus'
              }
            }
          },
          {
            name: 'price'
            type: 'u64'
          },
          {
            name: 'totalShares'
            type: 'u64'
          },
          {
            name: 'filledShares'
            type: 'u64'
          },
          {
            name: 'totalAmount'
            type: 'u64'
          },
          {
            name: 'filledAmount'
            type: 'u64'
          },
          {
            name: 'comment'
            type: {
              option: {
                array: ['u8', 64]
              }
            }
          },
          {
            name: 'refundAmount'
            type: {
              option: 'u64'
            }
          },
          {
            name: 'timestamp'
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'priceUpdate'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'marketId'
            type: 'u64'
          },
          {
            name: 'hypePrice'
            type: 'u64'
          },
          {
            name: 'flopPrice'
            type: 'u64'
          },
          {
            name: 'marketPrice'
            type: 'u64'
          },
          {
            name: 'direction'
            type: {
              defined: {
                name: 'orderDirection'
              }
            }
          },
          {
            name: 'timestamp'
            type: 'i64'
          },
          {
            name: 'comment'
            type: {
              option: {
                array: ['u8', 64]
              }
            }
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
            name: 'stakeVault'
            type: 'string'
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
      name: 'stakeV2'
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
            name: 'withdrawTs'
            type: 'i64'
          },
          {
            name: 'claimedTs'
            type: 'i64'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'mint'
            type: 'pubkey'
          },
          {
            name: 'boost'
            type: 'bool'
          },
          {
            name: 'stakeVault'
            type: 'pubkey'
          },
          {
            name: 'claimed'
            type: 'u64'
          },
          {
            name: 'available'
            type: 'u64'
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
      name: 'updateStakeVaultArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: {
              option: 'u64'
            }
          },
          {
            name: 'status'
            type: {
              option: 'bool'
            }
          },
          {
            name: 'stakeVault'
            type: 'string'
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
          },
          {
            name: 'swaps'
            type: 'i16'
          },
          {
            name: 'swapsMade'
            type: 'i16'
          },
          {
            name: 'staked'
            type: 'u64'
          },
          {
            name: 'firstSwap'
            type: 'i64'
          },
          {
            name: 'userTrade'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'userTrade'
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
            name: 'totalDeposits'
            docs: [
              'The total value of deposits the user has made (in TRD)',
              'precision: QUOTE_PRECISION'
            ]
            type: 'u64'
          },
          {
            name: 'totalWithdraws'
            docs: [
              'The total value of withdrawals the user has made (in TRD)',
              'precision: QUOTE_PRECISION'
            ]
            type: 'u64'
          },
          {
            name: 'openOrders'
            docs: ['Number of open orders']
            type: 'u8'
          },
          {
            name: 'hasOpenOrder'
            docs: ['Whether or not user has open order']
            type: 'bool'
          },
          {
            name: 'orders'
            type: {
              array: [
                {
                  defined: {
                    name: 'order'
                  }
                },
                10
              ]
            }
          },
          {
            name: 'position'
            type: 'i64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 64]
            }
          }
        ]
      }
    }
  ]
}
