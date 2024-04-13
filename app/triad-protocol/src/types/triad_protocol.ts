export type TriadProtocol = {
  version: '0.1.0'
  name: 'triad_protocol'
  instructions: [
    {
      name: 'createTicker'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'ticker'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'arg'
          type: {
            defined: 'CreateTickerArgs'
          }
        }
      ]
    },
    {
      name: 'createVault'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'payerTokenMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: 'CreateVaultArgs'
          }
        }
      ]
    },
    {
      name: 'deposit'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'vaultDepositor'
          isMut: true
          isSigner: false
        },
        {
          name: 'vaultTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'userTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        }
      ]
    },
    {
      name: 'createVaultDepositor'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: false
          isSigner: false
        },
        {
          name: 'vaultDepositor'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'withdraw'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'vaultDepositor'
          isMut: true
          isSigner: false
        },
        {
          name: 'vaultTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'userTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'ticker'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            docs: ['The bump for the ticker pda']
            type: 'u8'
          },
          {
            name: 'authority'
            docs: ['authority for the ticker']
            type: 'publicKey'
          },
          {
            name: 'name'
            docs: ['name of the ticekt']
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'tokenAccount'
            docs: ['token account for the ticker e.g. $tDRIFT']
            type: 'publicKey'
          },
          {
            name: 'tokenMint'
            docs: ['token mint for the ticker e.g. $tDRIFT']
            type: 'publicKey'
          },
          {
            name: 'initTs'
            docs: ['timestamp ticker initialized']
            type: 'i64'
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
            type: 'publicKey'
          },
          {
            name: 'name'
            docs: ['name of the vault']
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'tokenAccount'
            docs: ['token account for the vault e.g. USDC']
            type: 'publicKey'
          },
          {
            name: 'delegate'
            docs: ['delegate account for the vault']
            type: 'publicKey'
          },
          {
            name: 'maxTokens'
            docs: ['max number of tokens that can be deposited']
            type: 'u64'
          },
          {
            name: 'totalDeposits'
            docs: ['lifetime total deposits']
            type: 'u64'
          },
          {
            name: 'totalWithdraws'
            docs: ['lifetime total withdraws']
            type: 'u64'
          },
          {
            name: 'initTs'
            docs: ['timestamp vault initialized']
            type: 'i64'
          },
          {
            name: 'minDepositAmount'
            docs: ['the minimum deposit amount']
            type: 'u64'
          },
          {
            name: 'netDeposits'
            docs: ['lifetime net deposits']
            type: 'i64'
          },
          {
            name: 'netWithdraws'
            docs: ['lifetime net withdraws']
            type: 'i64'
          },
          {
            name: 'totalShares'
            docs: ['the sum of all shares']
            type: 'u128'
          },
          {
            name: 'profitShare'
            docs: ['percentage of gains for vault']
            type: 'u32'
          }
        ]
      }
    },
    {
      name: 'vaultDepositor'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'vault'
            type: 'publicKey'
          },
          {
            name: 'netDeposits'
            docs: ['lifetime net deposits of vault depositor for the vault']
            type: 'i64'
          },
          {
            name: 'netWithdraws'
            docs: ['lifetime net withdraws of vault depositor for the vault']
            type: 'i64'
          },
          {
            name: 'totalDeposits'
            docs: ['lifetime total deposits']
            type: 'u64'
          },
          {
            name: 'totalWithdraws'
            docs: ['lifetime total withdraws']
            type: 'u64'
          },
          {
            name: 'lpShares'
            type: 'u64'
          }
        ]
      }
    }
  ]
  types: [
    {
      name: 'CreateTickerArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: {
              array: ['u8', 32]
            }
          }
        ]
      }
    },
    {
      name: 'CreateVaultArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'maxTokens'
            type: 'u64'
          },
          {
            name: 'minDepositAmount'
            type: 'u64'
          },
          {
            name: 'profitShare'
            type: 'u32'
          }
        ]
      }
    }
  ]
  errors: [
    {
      code: 6000
      name: 'UnauthorizedToDeleteProject'
      msg: 'Unauthorized to delete the project'
    },
    {
      code: 6001
      name: 'InvalidShadowAccount'
      msg: 'Invalid shadow account'
    },
    {
      code: 6002
      name: 'InvalidAccount'
      msg: 'Invalid account'
    },
    {
      code: 6003
      name: 'Unauthorized'
      msg: 'Unauthorized access'
    },
    {
      code: 6004
      name: 'InvalidPassType'
      msg: 'Invalid pass type'
    },
    {
      code: 6005
      name: 'InvalidVaultDepositorAuthority'
      msg: 'Invalid vault depositor authority'
    },
    {
      code: 6006
      name: 'InvalidOwnerAuthority'
      msg: 'Invalid owner authority'
    },
    {
      code: 6007
      name: 'InvalidMintAddress'
      msg: 'Invalid mint address'
    },
    {
      code: 6008
      name: 'InvalidMaxTokens'
      msg: 'Invalid Max Tokens'
    },
    {
      code: 6009
      name: 'InvalidProfitShare'
      msg: 'Invalid Profit Share'
    },
    {
      code: 6010
      name: 'InvalidDepositAmount'
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6011
      name: 'InvalidWithdrawAmount'
      msg: 'Invalid Withdraw Amount'
    }
  ]
}

export const IDL: TriadProtocol = {
  version: '0.1.0',
  name: 'triad_protocol',
  instructions: [
    {
      name: 'createTicker',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'ticker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'arg',
          type: {
            defined: 'CreateTickerArgs'
          }
        }
      ]
    },
    {
      name: 'createVault',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'payerTokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'CreateVaultArgs'
          }
        }
      ]
    },
    {
      name: 'deposit',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultDepositor',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        }
      ]
    },
    {
      name: 'createVaultDepositor',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'vault',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultDepositor',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultDepositor',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'ticker',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            docs: ['The bump for the ticker pda'],
            type: 'u8'
          },
          {
            name: 'authority',
            docs: ['authority for the ticker'],
            type: 'publicKey'
          },
          {
            name: 'name',
            docs: ['name of the ticekt'],
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'tokenAccount',
            docs: ['token account for the ticker e.g. $tDRIFT'],
            type: 'publicKey'
          },
          {
            name: 'tokenMint',
            docs: ['token mint for the ticker e.g. $tDRIFT'],
            type: 'publicKey'
          },
          {
            name: 'initTs',
            docs: ['timestamp ticker initialized'],
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'vault',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            docs: ['The bump for the vault pda'],
            type: 'u8'
          },
          {
            name: 'authority',
            docs: ['authority for the vault'],
            type: 'publicKey'
          },
          {
            name: 'name',
            docs: ['name of the vault'],
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'tokenAccount',
            docs: ['token account for the vault e.g. USDC'],
            type: 'publicKey'
          },
          {
            name: 'delegate',
            docs: ['delegate account for the vault'],
            type: 'publicKey'
          },
          {
            name: 'maxTokens',
            docs: ['max number of tokens that can be deposited'],
            type: 'u64'
          },
          {
            name: 'totalDeposits',
            docs: ['lifetime total deposits'],
            type: 'u64'
          },
          {
            name: 'totalWithdraws',
            docs: ['lifetime total withdraws'],
            type: 'u64'
          },
          {
            name: 'initTs',
            docs: ['timestamp vault initialized'],
            type: 'i64'
          },
          {
            name: 'minDepositAmount',
            docs: ['the minimum deposit amount'],
            type: 'u64'
          },
          {
            name: 'netDeposits',
            docs: ['lifetime net deposits'],
            type: 'i64'
          },
          {
            name: 'netWithdraws',
            docs: ['lifetime net withdraws'],
            type: 'i64'
          },
          {
            name: 'totalShares',
            docs: ['the sum of all shares'],
            type: 'u128'
          },
          {
            name: 'profitShare',
            docs: ['percentage of gains for vault'],
            type: 'u32'
          }
        ]
      }
    },
    {
      name: 'vaultDepositor',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'authority',
            type: 'publicKey'
          },
          {
            name: 'vault',
            type: 'publicKey'
          },
          {
            name: 'netDeposits',
            docs: ['lifetime net deposits of vault depositor for the vault'],
            type: 'i64'
          },
          {
            name: 'netWithdraws',
            docs: ['lifetime net withdraws of vault depositor for the vault'],
            type: 'i64'
          },
          {
            name: 'totalDeposits',
            docs: ['lifetime total deposits'],
            type: 'u64'
          },
          {
            name: 'totalWithdraws',
            docs: ['lifetime total withdraws'],
            type: 'u64'
          },
          {
            name: 'lpShares',
            type: 'u64'
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'CreateTickerArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: {
              array: ['u8', 32]
            }
          }
        ]
      }
    },
    {
      name: 'CreateVaultArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'maxTokens',
            type: 'u64'
          },
          {
            name: 'minDepositAmount',
            type: 'u64'
          },
          {
            name: 'profitShare',
            type: 'u32'
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'UnauthorizedToDeleteProject',
      msg: 'Unauthorized to delete the project'
    },
    {
      code: 6001,
      name: 'InvalidShadowAccount',
      msg: 'Invalid shadow account'
    },
    {
      code: 6002,
      name: 'InvalidAccount',
      msg: 'Invalid account'
    },
    {
      code: 6003,
      name: 'Unauthorized',
      msg: 'Unauthorized access'
    },
    {
      code: 6004,
      name: 'InvalidPassType',
      msg: 'Invalid pass type'
    },
    {
      code: 6005,
      name: 'InvalidVaultDepositorAuthority',
      msg: 'Invalid vault depositor authority'
    },
    {
      code: 6006,
      name: 'InvalidOwnerAuthority',
      msg: 'Invalid owner authority'
    },
    {
      code: 6007,
      name: 'InvalidMintAddress',
      msg: 'Invalid mint address'
    },
    {
      code: 6008,
      name: 'InvalidMaxTokens',
      msg: 'Invalid Max Tokens'
    },
    {
      code: 6009,
      name: 'InvalidProfitShare',
      msg: 'Invalid Profit Share'
    },
    {
      code: 6010,
      name: 'InvalidDepositAmount',
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6011,
      name: 'InvalidWithdrawAmount',
      msg: 'Invalid Withdraw Amount'
    }
  ]
}
