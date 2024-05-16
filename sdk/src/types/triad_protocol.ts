export type TriadProtocol = {
  version: '0.1.0'
  name: 'triad_protocol'
  instructions: [
    {
      name: 'createUser'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'user'
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
            defined: 'CreateUserArgs'
          }
        }
      ]
    },
    {
      name: 'createTicker'
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
      name: 'updateTickerPrice'
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
          name: 'args'
          type: {
            defined: 'UpdateTickerPriceArgs'
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
          name: 'ticker'
          isMut: true
          isSigner: false
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
      args: []
    },
    {
      name: 'openPosition'
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
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
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
          name: 'args'
          type: {
            defined: 'OpenPositionArgs'
          }
        }
      ]
    },
    {
      name: 'closePosition'
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
          name: 'user'
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
          name: 'args'
          type: {
            defined: 'ClosePositionArgs'
          }
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
            type: 'publicKey'
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
            type: 'publicKey'
          },
          {
            name: 'price'
            docs: ['ticker price']
            type: 'u64'
          },
          {
            name: 'vault'
            docs: ['Vault PDA']
            type: 'publicKey'
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
            docs: ['timestamp']
            type: 'i64'
          },
          {
            name: 'name'
            docs: ["user's name"]
            type: 'string'
          },
          {
            name: 'bump'
            docs: ['bump seed']
            type: 'u8'
          },
          {
            name: 'authority'
            docs: ["user's authority"]
            type: 'publicKey'
          },
          {
            name: 'referrer'
            docs: ['referrer of the user']
            type: 'string'
          },
          {
            name: 'community'
            docs: ['community the user is part of']
            type: 'string'
          },
          {
            name: 'netDeposits'
            docs: ['lifetime net deposits of user']
            type: 'i64'
          },
          {
            name: 'netWithdraws'
            docs: ['lifetime net withdraws of user']
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
            docs: ['total available balance']
            type: 'u64'
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
            type: 'string'
          },
          {
            name: 'tokenAccount'
            docs: ['token account for the vault e.g. tDRIFT']
            type: 'publicKey'
          },
          {
            name: 'tickerAddress'
            docs: ['ticker address']
            type: 'publicKey'
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
            name: 'netDeposits'
            docs: ['lifetime net deposits']
            type: 'u64'
          },
          {
            name: 'netWithdraws'
            docs: ['lifetime net withdraws']
            type: 'u64'
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
          },
          {
            name: 'ticker'
            docs: ['Ticker PDA']
            type: 'publicKey'
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
            type: 'string'
          },
          {
            name: 'protocolProgramId'
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'UpdateTickerPriceArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'alphaApiKey'
            type: {
              array: ['u8', 64]
            }
          },
          {
            name: 'price'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'Position'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pubkey'
            type: 'publicKey'
          },
          {
            name: 'ticker'
            type: 'publicKey'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'leverage'
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
      name: 'CreateUserArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'referrer'
            type: 'string'
          },
          {
            name: 'community'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'OpenPositionArgs'
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
      name: 'ClosePositionArgs'
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
          },
          {
            name: 'pubkey'
            type: 'publicKey'
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
      name: 'AlphaVantageApiError'
      msg: 'Failed to get data from Vybe Network'
    },
    {
      code: 6005
      name: 'DepositFailed'
      msg: 'Failed to deposit'
    },
    {
      code: 6006
      name: 'InvalidOwnerAuthority'
      msg: 'Invalid Owner authority'
    },
    {
      code: 6007
      name: 'InvalidMintAddress'
      msg: 'Invalid Mint address'
    },
    {
      code: 6008
      name: 'InvalidProfitShare'
      msg: 'Invalid Profit Share'
    },
    {
      code: 6009
      name: 'InvalidDepositAmount'
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6010
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
      name: 'createUser',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'user',
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
            defined: 'CreateUserArgs'
          }
        }
      ]
    },
    {
      name: 'createTicker',
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
      name: 'updateTickerPrice',
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
          name: 'args',
          type: {
            defined: 'UpdateTickerPriceArgs'
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
          name: 'ticker',
          isMut: true,
          isSigner: false
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
      args: []
    },
    {
      name: 'openPosition',
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
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'user',
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
          name: 'args',
          type: {
            defined: 'OpenPositionArgs'
          }
        }
      ]
    },
    {
      name: 'closePosition',
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
          name: 'user',
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
          name: 'args',
          type: {
            defined: 'ClosePositionArgs'
          }
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
            name: 'initTs',
            docs: ['timestamp of the creation of the ticker'],
            type: 'i64'
          },
          {
            name: 'updatedTs',
            docs: ['timestamp of the last update of the ticker'],
            type: 'i64'
          },
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
            type: 'string'
          },
          {
            name: 'protocolProgramId',
            docs: [
              'protocol program id like dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH to get data info'
            ],
            type: 'publicKey'
          },
          {
            name: 'price',
            docs: ['ticker price'],
            type: 'u64'
          },
          {
            name: 'vault',
            docs: ['Vault PDA'],
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'user',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'ts',
            docs: ['timestamp'],
            type: 'i64'
          },
          {
            name: 'name',
            docs: ["user's name"],
            type: 'string'
          },
          {
            name: 'bump',
            docs: ['bump seed'],
            type: 'u8'
          },
          {
            name: 'authority',
            docs: ["user's authority"],
            type: 'publicKey'
          },
          {
            name: 'referrer',
            docs: ['referrer of the user'],
            type: 'string'
          },
          {
            name: 'community',
            docs: ['community the user is part of'],
            type: 'string'
          },
          {
            name: 'netDeposits',
            docs: ['lifetime net deposits of user'],
            type: 'i64'
          },
          {
            name: 'netWithdraws',
            docs: ['lifetime net withdraws of user'],
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
            docs: ['total available balance'],
            type: 'u64'
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
            type: 'string'
          },
          {
            name: 'tokenAccount',
            docs: ['token account for the vault e.g. tDRIFT'],
            type: 'publicKey'
          },
          {
            name: 'tickerAddress',
            docs: ['ticker address'],
            type: 'publicKey'
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
            name: 'netDeposits',
            docs: ['lifetime net deposits'],
            type: 'u64'
          },
          {
            name: 'netWithdraws',
            docs: ['lifetime net withdraws'],
            type: 'u64'
          },
          {
            name: 'longBalance',
            docs: ['Long bet balance'],
            type: 'u64'
          },
          {
            name: 'shortBalance',
            docs: ['Short bet balance'],
            type: 'u64'
          },
          {
            name: 'longPositionsOpened',
            docs: ['Opened long positions'],
            type: 'u64'
          },
          {
            name: 'shortPositionsOpened',
            docs: ['Opened short positions'],
            type: 'u64'
          },
          {
            name: 'ticker',
            docs: ['Ticker PDA'],
            type: 'publicKey'
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
            type: 'string'
          },
          {
            name: 'protocolProgramId',
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'UpdateTickerPriceArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'alphaApiKey',
            type: {
              array: ['u8', 64]
            }
          },
          {
            name: 'price',
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'Position',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pubkey',
            type: 'publicKey'
          },
          {
            name: 'ticker',
            type: 'publicKey'
          },
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'leverage',
            type: 'u64'
          },
          {
            name: 'entryPrice',
            type: 'u64'
          },
          {
            name: 'ts',
            type: 'i64'
          },
          {
            name: 'isLong',
            type: 'bool'
          },
          {
            name: 'isOpen',
            type: 'bool'
          },
          {
            name: 'pnl',
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'CreateUserArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string'
          },
          {
            name: 'referrer',
            type: 'string'
          },
          {
            name: 'community',
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'OpenPositionArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'isLong',
            type: 'bool'
          }
        ]
      }
    },
    {
      name: 'ClosePositionArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'isLong',
            type: 'bool'
          },
          {
            name: 'pubkey',
            type: 'publicKey'
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
      name: 'AlphaVantageApiError',
      msg: 'Failed to get data from Vybe Network'
    },
    {
      code: 6005,
      name: 'DepositFailed',
      msg: 'Failed to deposit'
    },
    {
      code: 6006,
      name: 'InvalidOwnerAuthority',
      msg: 'Invalid Owner authority'
    },
    {
      code: 6007,
      name: 'InvalidMintAddress',
      msg: 'Invalid Mint address'
    },
    {
      code: 6008,
      name: 'InvalidProfitShare',
      msg: 'Invalid Profit Share'
    },
    {
      code: 6009,
      name: 'InvalidDepositAmount',
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6010,
      name: 'InvalidWithdrawAmount',
      msg: 'Invalid Withdraw Amount'
    }
  ]
}
