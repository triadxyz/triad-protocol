export type TriadProtocol = {
  version: '0.1.0'
  name: 'triad_protocol'
  instructions: [
    {
      name: 'createUserPosition'
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
          name: 'userPosition'
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
          name: 'userPosition'
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
          name: 'userPosition'
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
            type: 'publicKey'
          },
          {
            name: 'authority'
            docs: ["user's authority"]
            type: 'publicKey'
          },
          {
            name: 'positions'
            docs: ["user's position"]
            type: {
              array: [
                {
                  defined: 'Position'
                },
                6
              ]
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
    }
  ]
  types: [
    {
      name: 'Position'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'ticker'
            type: 'publicKey'
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
            name: 'price'
            type: 'u64'
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
            name: 'positionIndex'
            type: 'u8'
          }
        ]
      }
    }
  ]
  events: [
    {
      name: 'OpenPositionRecord'
      fields: [
        {
          name: 'amount'
          type: 'u64'
          index: false
        },
        {
          name: 'ticker'
          type: 'publicKey'
          index: false
        },
        {
          name: 'entryPrice'
          type: 'u64'
          index: false
        },
        {
          name: 'ts'
          type: 'i64'
          index: false
        },
        {
          name: 'isLong'
          type: 'bool'
          index: false
        },
        {
          name: 'user'
          type: 'publicKey'
          index: false
        }
      ]
    },
    {
      name: 'ClosePositionRecord'
      fields: [
        {
          name: 'amount'
          type: 'u64'
          index: false
        },
        {
          name: 'ticker'
          type: 'publicKey'
          index: false
        },
        {
          name: 'closePrice'
          type: 'u64'
          index: false
        },
        {
          name: 'ts'
          type: 'i64'
          index: false
        },
        {
          name: 'isLong'
          type: 'bool'
          index: false
        },
        {
          name: 'pnl'
          type: 'i64'
          index: false
        },
        {
          name: 'user'
          type: 'publicKey'
          index: false
        }
      ]
    },
    {
      name: 'TickerPriceUpdateRecord'
      fields: [
        {
          name: 'price'
          type: 'u64'
          index: false
        },
        {
          name: 'ts'
          type: 'i64'
          index: false
        },
        {
          name: 'ticker'
          type: 'publicKey'
          index: false
        }
      ]
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
      name: 'InvalidPosition'
      msg: 'Invalid Position'
    },
    {
      code: 6008
      name: 'InvalidTickerPosition'
      msg: 'Invalid Ticker position'
    },
    {
      code: 6009
      name: 'NoFreePositionSlot'
      msg: 'No free position slot'
    },
    {
      code: 6010
      name: 'InvalidMintAddress'
      msg: 'Invalid Mint address'
    },
    {
      code: 6011
      name: 'InvalidProfitShare'
      msg: 'Invalid Profit Share'
    },
    {
      code: 6012
      name: 'InvalidDepositAmount'
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6013
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
      name: 'createUserPosition',
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
          name: 'userPosition',
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
          name: 'userPosition',
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
          name: 'userPosition',
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
      name: 'userPosition',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'ts',
            docs: ['timestamp'],
            type: 'i64'
          },
          {
            name: 'bump',
            docs: ['bump seed'],
            type: 'u8'
          },
          {
            name: 'totalDeposited',
            docs: ['total deposited'],
            type: 'u64'
          },
          {
            name: 'totalWithdrawn',
            docs: ['total withdrawn'],
            type: 'u64'
          },
          {
            name: 'lpShare',
            docs: ['total liquidity provided'],
            type: 'u64'
          },
          {
            name: 'totalPositions',
            docs: ['total positions'],
            type: 'u16'
          },
          {
            name: 'ticker',
            docs: ['ticker account'],
            type: 'publicKey'
          },
          {
            name: 'authority',
            docs: ["user's authority"],
            type: 'publicKey'
          },
          {
            name: 'positions',
            docs: ["user's position"],
            type: {
              array: [
                {
                  defined: 'Position'
                },
                6
              ]
            }
          }
        ]
      }
    },
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
            name: 'totalDeposited',
            docs: ['lifetime total deposited'],
            type: 'u64'
          },
          {
            name: 'totalWithdrawn',
            docs: ['lifetime total withdrawn'],
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
            type: 'u128'
          },
          {
            name: 'netWithdraws',
            docs: ['lifetime net withdraws'],
            type: 'u128'
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
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'Position',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'ticker',
            type: 'publicKey'
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
            name: 'price',
            type: 'u64'
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
            name: 'positionIndex',
            type: 'u8'
          }
        ]
      }
    }
  ],
  events: [
    {
      name: 'OpenPositionRecord',
      fields: [
        {
          name: 'amount',
          type: 'u64',
          index: false
        },
        {
          name: 'ticker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'entryPrice',
          type: 'u64',
          index: false
        },
        {
          name: 'ts',
          type: 'i64',
          index: false
        },
        {
          name: 'isLong',
          type: 'bool',
          index: false
        },
        {
          name: 'user',
          type: 'publicKey',
          index: false
        }
      ]
    },
    {
      name: 'ClosePositionRecord',
      fields: [
        {
          name: 'amount',
          type: 'u64',
          index: false
        },
        {
          name: 'ticker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'closePrice',
          type: 'u64',
          index: false
        },
        {
          name: 'ts',
          type: 'i64',
          index: false
        },
        {
          name: 'isLong',
          type: 'bool',
          index: false
        },
        {
          name: 'pnl',
          type: 'i64',
          index: false
        },
        {
          name: 'user',
          type: 'publicKey',
          index: false
        }
      ]
    },
    {
      name: 'TickerPriceUpdateRecord',
      fields: [
        {
          name: 'price',
          type: 'u64',
          index: false
        },
        {
          name: 'ts',
          type: 'i64',
          index: false
        },
        {
          name: 'ticker',
          type: 'publicKey',
          index: false
        }
      ]
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
      name: 'InvalidPosition',
      msg: 'Invalid Position'
    },
    {
      code: 6008,
      name: 'InvalidTickerPosition',
      msg: 'Invalid Ticker position'
    },
    {
      code: 6009,
      name: 'NoFreePositionSlot',
      msg: 'No free position slot'
    },
    {
      code: 6010,
      name: 'InvalidMintAddress',
      msg: 'Invalid Mint address'
    },
    {
      code: 6011,
      name: 'InvalidProfitShare',
      msg: 'Invalid Profit Share'
    },
    {
      code: 6012,
      name: 'InvalidDepositAmount',
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6013,
      name: 'InvalidWithdrawAmount',
      msg: 'Invalid Withdraw Amount'
    }
  ]
}
