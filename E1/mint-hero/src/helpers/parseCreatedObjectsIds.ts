import { SuiObjectChange, SuiObjectChangeCreated } from "@mysten/sui/client";
import { ENV } from "../env";

interface Args {
  objectChanges: SuiObjectChange[];
}

interface Response {
  swordsIds: string[];
  heroesIds: string[];
}

/**
 * Parses the provided SuiObjectChange[].
 * Extracts the IDs of the created Heroes and Swords NFTs, filtering by objectType.
 */
export const parseCreatedObjectsIds = ({ objectChanges }: Args): Response => {
  // Filter the object changes by the Hero type and return the object ids
  const heroesIds = objectChanges
    .filter(
      (change): change is SuiObjectChangeCreated =>
        change.type === "created" &&
        change.objectType === `${ENV.PACKAGE_ID}::hero::Hero`,
    )
    .map((change) => change.objectId);

  console.log("heroesIds", heroesIds);

  // Filter the object changes by the Sword type and return the object ids
  const swordsIds = objectChanges
    .filter(
      (change): change is SuiObjectChangeCreated =>
        change.type === "created" &&
        change.objectType === `${ENV.PACKAGE_ID}::blacksmith::Sword`,
    )
    .map((change) => change.objectId);

  console.log("swordsIds", swordsIds);

  return {
    swordsIds,
    heroesIds,
  };
};
