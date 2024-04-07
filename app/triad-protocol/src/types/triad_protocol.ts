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
            name: 'initTs'
            docs: ['timestamp ticker initialized']
            type: 'i64'
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
    }
  ]
  errors: [
    {
      code: 6000
      name: 'InvalidAccount'
      msg: 'Invalid account'
    },
    {
      code: 6001
      name: 'Unauthorized'
      msg: 'Unauthorized access'
    },
    {
      code: 6002
      name: 'InvalidOwnerAuthority'
      msg: 'Invalid owner authority'
    },
    {
      code: 6003
      name: 'InvalidMintAddress'
      msg: 'Invalid mint address'
    },
    {
      code: 6004
      name: 'InvalidMaxTokens'
      msg: 'Invalid Max Tokens'
    },
    {
      code: 6005
      name: 'InvalidProfitShare'
      msg: 'Invalid Profit Share'
    },
    {
      code: 6006
      name: 'InvalidDepositAmount'
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6007
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
            name: 'initTs',
            docs: ['timestamp ticker initialized'],
            type: 'i64'
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
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidAccount',
      msg: 'Invalid account'
    },
    {
      code: 6001,
      name: 'Unauthorized',
      msg: 'Unauthorized access'
    },
    {
      code: 6002,
      name: 'InvalidOwnerAuthority',
      msg: 'Invalid owner authority'
    },
    {
      code: 6003,
      name: 'InvalidMintAddress',
      msg: 'Invalid mint address'
    },
    {
      code: 6004,
      name: 'InvalidMaxTokens',
      msg: 'Invalid Max Tokens'
    },
    {
      code: 6005,
      name: 'InvalidProfitShare',
      msg: 'Invalid Profit Share'
    },
    {
      code: 6006,
      name: 'InvalidDepositAmount',
      msg: 'Invalid Deposit Amount'
    },
    {
      code: 6007,
      name: 'InvalidWithdrawAmount',
      msg: 'Invalid Withdraw Amount'
    }
  ]
}
