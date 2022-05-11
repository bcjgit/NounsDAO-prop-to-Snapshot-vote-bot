import { ethers } from "ethers";
import axios from "axios";
import snapshot from "@snapshot-labs/snapshot.js";
import { config } from "./config.mjs";

const getCurrentUnixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Check if a snapshot vote for a given prop already exists in a given space
 * @param proposal NounsDAO proposal
 * @param space Snapshot space (i.e. abc.eth )
 */
export const checkIfSnapshotForPropAlreadyExists = async (proposal, space) => {
  const graphQlResult = await makeGraphQLQuery(
    `
        query Proposals {
            proposals (
            first: 10,
            skip: 0,
            where: {
                space_in: ["${space}"],
            },
            orderBy: "created",
            orderDirection: desc
            ) {
            id
            title
            }
        }
        `,
    "https://hub.snapshot.org/graphql"
  );

  const snapshotProposals = graphQlResult.data.data.proposals;
  if (!snapshotProposals) {
    console.log("No proposals found for space");
    return false;
  }

  return (
    snapshotProposals.filter((prop) => {
      return prop.title.toLowerCase().includes(`prop ${proposal.id}`);
    }).length  > 0
  );
};

/**
 * Queries graphQLQueryString with graphQLQueryString
 *
 * @returns GraphQL query result
 */
export const makeGraphQLQuery = async (graphQLQueryString, graphQLQueryURL) => {
  try {
    return await axios({
      url: graphQLQueryURL,
      method: "post",
      data: {
        query: graphQLQueryString,
      },
      timeout: 5000,
    });
  } catch (err) {
    console.log("Error making GraphQL query to endpoint: ", graphQLQueryURL);
    console.log("ERROR: ", err);
    return null;
  }
};

const getPropToAdd = async (nounsSubgraphURL) => {
  const graphQLResult = await makeGraphQLQuery(
    `{
        proposals(orderBy: startBlock, orderDirection: desc, first: 1) {
            id
            description
            createdTimestamp
            status
        }
     }`,
    nounsSubgraphURL
  );

  const mostRecentPropInfo = graphQLResult?.data.data.proposals[0];

  if (mostRecentPropInfo.status === 'PENDING' || mostRecentPropInfo.status === 'ACTIVE') {
    console.log("Pending or active proposal detected");
    return {
      id: Number(mostRecentPropInfo.id),
      createdTimestamp: Number(mostRecentPropInfo.createdTimestamp),
      description: mostRecentPropInfo.description,
    };
  }

  return null; 
};

const pushProposalToSnapshot = async (
  provider,
  snapshotClient,
  wallet,
  proposal,
  snapshotSpace,
  snapshotVoteChoices,
  serializedSnapshotStrategies,
  snapshotType,
  votingPeriodSeconds,
  propStartOffsetSeconds
) => {
  const blockNumber = await provider.getBlockNumber();

  const snapshotData = {
    space: snapshotSpace,
    type: snapshotType,
    title: `NounsDAO Prop ${proposal.id}`,
    body: String(proposal.description),
    choices: snapshotVoteChoices,
    start: Number(proposal.createdTimestamp) + propStartOffsetSeconds,
    end:
      Number(proposal.createdTimestamp) +
      propStartOffsetSeconds +
      votingPeriodSeconds,
    snapshot: Number(blockNumber),
    network: "1",
    strategies: serializedSnapshotStrategies,
    plugins: JSON.stringify({}),
    metadata: JSON.stringify({ app: "snapshot.js" }),
  };

  return await snapshotClient.proposal(wallet, wallet.address, snapshotData);
};

export const scheduledEventLoggerHandler = async (event, context) => {
  const maybeProp = await getPropToAdd(
    config.nounsGraphQLLink,
    config.secondsBetweenRuns
  );

  // Nothing to do
  if (!maybeProp) {
    if (config.moniteringURL) {
      await axios(config.moniteringURL);
    }
    console.log("No props to add - latest prop is not pending or active");
    return {
      status: "NO_OP",
    };
  }

  // Check if a prop already exists
  if (await checkIfSnapshotForPropAlreadyExists(maybeProp, config.space)) {
    if (config.moniteringURL) {
      await axios(config.moniteringURL);
    }
    console.log("No props to add - snapshot already exists for prop");
    return {
      status: "NO_OP",
    };
  }

  console.log(`Creating new snapshot vote in space ${config.space} for NounsDAO prop ${maybeProp.id}`)

  const provider = new ethers.providers.InfuraProvider(
    config.ethNetwork,
    config.infuraID
  );
  const wallet = new ethers.Wallet(config.walletPrivateKey);
  const client = new snapshot.Client712(config.snapshotURL);

  let result;
  // Submit the prop
  try {
    result = await pushProposalToSnapshot(
      provider,
      client,
      wallet,
      maybeProp,
      config.space,
      config.snapshotVoteChoices,
      JSON.stringify(config.snapshotStrategy),
      config.snapshotType,
      config.snapshotVotingLengthSeconds,
      config.propStartOffsetSeconds
    );
  } catch (err) {
    console.log("Error pushing proposal to snapshot");
    return {
      status: "ERROR",
      errorMessage: JSON.stringify(err),
    };
  }

  // call monitering URL if everything went smoothly
  if (config.moniteringURL) {
    await axios(config.moniteringURL);
  }
  console.log("Prop added to snapshot");
  return {
    status: "PROP_ADDED",
  };
};
