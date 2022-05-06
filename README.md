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

- Once you've filled out the config return to the TLD of the repo
- Run `sam build --container`
- Run `sam deploy --guided`

Assuming that worked you now have a bot that will run every 15 minutes (unless you adjusted this in the `template.yml` file) and add new Snapshot votes if it detects new `NounsDAO` props. 

Congrats, and stay Nounish ⌐◨-◨ 

