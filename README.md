# NounsDAO-prop-to-Snapshot-vote-bot

Creates Snapshot votes for your subdao automatically when new `NounsDAO` props are put on-chain


## Getting Started


### You will need:
1. A Snapshot for your subdao (Info on how to do that: https://docs.snapshot.org/)
2. A (free) Infura API key (Info on how to get one: https://infura.io/)
3. A wallet (ideally, fresh and never to be used for **anything** other than this) contaning enough of your subdao's governance token to create new Snapshot votes
4. The **strategy** JSON from your Snapshot's setting
5. An AWS account
6. Aws `sam-cli` on your computer

### Setting up
- Clone the repo and `cd` into it
- Go to `src/handlers/config.mjs`
- Run `npm install` in the top level directory
- Fill out all info relevent to your subdao

#### What all the config parameters mean

- `secondsBetweenRuns`: The time between runs of the job. This is based off the `cron` statement you added in `template.yml`. Probably best not to change this
- `nounsGraphQLLink`: URL ponting to the Nouns subgraph. Again, probably best not to change this
- \[**NEEDS VALUE**\] `space`: the name of your Snapshot space (eg: `sharkdao.eth`)
- \[**NEEDS VALUE**\] `infuraID`: Your infura API key
- \[**NEEDS VALUE**\] `walletPrivateKey`: Private key to a wallet containing your governance tokens (and ideally, **only** your governance tokens)
- `ethNetwork`: Which eth chain to use (e.g. mainnet, rinkeby, etc.). Best not to change this unless you know what you're doing
- `snapshotURL`: The URL for the Snapshot API
- `snapshotVoteChoices`: The options users will have for their vote (E.g. For, Aginst, Abstain, or anything else you'd want to add / remove)
- \[**NEEDS VALUE**\] `snapshotStrategy`: The Snapshot strategy (i.e. how to map token balance => vote power). This is a JSON that can be found in your Snapshot settings. If you have multiple stratgies, enter them as multiple JSON entries in the array.
- `snapshotType`: Type of voting (e.g. single choice, multiple choice, etc.)
- `snapshotVotingLengthSeconds`: How long the Snapshot vote should be active for. Default is 4 days.
- `propStartOffsetSeconds`: How long after being created should the Snapshot vote be open for voting. Default is 5 minutes.
- `moniteringURL`: A URL to call after sucessful run of the batch


- Once you've filled out the config return to the TLD of the repo
- Run `sam build --container`
- Run `sam deploy --guided`

Assuming that worked you now have a bot that will run every 15 minutes (unless you adjusted this in the `template.yml` file) and add new Snapshot votes if it detects new `NounsDAO` props. 

Congrats, and stay Nounish ⌐◨-◨ 


### A note on security
One downside of this, I'll admit is storing the wallet private key in plain text. If / when I have time, I'll enable the use AWS secrets manager to store that. That said, right now the idea is that even if the private key is compromised the worst you should lose is a few subdao governance tokens which shouldn't be too too big a loss (but who knows maybe they'll 🚀).
