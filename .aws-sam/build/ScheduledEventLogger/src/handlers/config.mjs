export const config = {
  scondsBetweenRuns: 9000000000,
  nounsGraphQLLink:
    "https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph",
  space: "pbrianandj.eth",
  infuraID: "f74ad8aacd6a44a7a52f4db811276bcd",
  walletPrivateKey:
    "97a2a56dd3a8732edf65bd103c32c6611255c4ace5ea6087e1b2197cc72848d5",
  ethNetwork: "homestead",
  snapshotURL: "https://hub.snapshot.org",
  snapshotVoteChoices: ["For", "Against", "Abstain"],
  snapshotStrategy: `[
    {
        "symbol": "SHARK Delegated",
        "strategies": [
          {
            "name": "contract-call",
            "params": {
              "args": [
                "%{address}",
                "0x07"
              ],
              "symbol": "SHARK",
              "address": "0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc",
              "decimals": 18,
              "methodABI": {
                "name": "balanceOf",
                "type": "function",
                "inputs": [
                  {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ],
                "outputs": [
                  {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ],
                "stateMutability": "view"
              }
            }
          }
        ]
      },
      {
        "args": [
          "%{address}",
          "0x07"
        ],
        "symbol": "SHARK",
        "address": "0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc",
        "decimals": 18,
        "methodABI": {
          "name": "balanceOf",
          "type": "function",
          "inputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        }
      }
]`,
  snapshotType: "single-choice",
  snapshotVotingLengthSeconds: 345600,
  propStartOffsetSeconds: 300,
  moniteringURL: "",
};
