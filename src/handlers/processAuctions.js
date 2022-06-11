import { closeAuction } from "../lib/closeAcution";
import createError from "http-errors";
import { getEndedFunctions } from "../lib/getEndedAuctions";

const processAuctions = async (event, context) => {
  try {
    const auctiounsToClose = await getEndedFunctions();
    const closePromises = auctiounsToClose.map((auction) => {
      return closeAuction(auction.id);
    });
    await Promise.all(closePromises);

    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

export const handler = processAuctions;
