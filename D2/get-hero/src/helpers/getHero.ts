import { SuiObjectResponse } from "@mysten/sui/client";
import { suiClient } from "../suiClient";

/**
 * Uses SuiClient to get a hero object by its ID.
 * Uses the required SDK options to include the content and the type of the object in the response.
 */
export const getHero = async (id: string): Promise<SuiObjectResponse> => {
  //Implement the function to get the hero object by its ID
  const objectResponse = await suiClient.getObject({
    id,
    options: {
      showContent: true,
      showType: true,
    },
  });
  if (!objectResponse.data) {
    throw new Error(`Hero object not found with id: ${id}`);
  }
    return objectResponse;
};
