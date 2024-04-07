export type TriadMarkets = {
  version: '0.1.0'
  name: 'triad_markets'
  instructions: [
    {
      name: 'createTicket'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'ticket'
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
            defined: 'CreateTicketArgs'
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'ticket'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            docs: ['The bump for the ticket pda']
            type: 'u8'
          },
          {
            name: 'authority'
            docs: ['authority for the ticket']
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
            docs: ['token account for the ticket e.g. $tDRIFT']
            type: 'publicKey'
          },
          {
            name: 'initTs'
            docs: ['timestamp ticket initialized']
            type: 'i64'
          }
        ]
      }
    }
  ]
  types: [
    {
      name: 'CreateTicketArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
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

export const IDL: TriadMarkets = {
  version: '0.1.0',
  name: 'triad_markets',
  instructions: [
    {
      name: 'createTicket',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'ticket',
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
            defined: 'CreateTicketArgs'
          }
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'ticket',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            docs: ['The bump for the ticket pda'],
            type: 'u8'
          },
          {
            name: 'authority',
            docs: ['authority for the ticket'],
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
            docs: ['token account for the ticket e.g. $tDRIFT'],
            type: 'publicKey'
          },
          {
            name: 'initTs',
            docs: ['timestamp ticket initialized'],
            type: 'i64'
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'CreateTicketArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string'
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
