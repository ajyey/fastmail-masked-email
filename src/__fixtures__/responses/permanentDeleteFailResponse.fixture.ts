export const permanentDeleteFailResponseFixture = {
  methodResponses: [
    [
      'MaskedEmail/set',
      {
        accountId: 'u7cb112016d',
        updated: {},
        newState: null,
        created: {},
        notDestroyed: {
          'masked-81873752': {
            subType: 'addressInUse',
            description:
              'Only masked emails that have not received email can be destroyed',
            type: 'forbidden'
          }
        },
        destroyed: [],
        oldState: null
      },
      'a'
    ]
  ],
  latestClientVersion: '',
  sessionState: 'cyrus-68;p-a4a5aaba4e'
};
