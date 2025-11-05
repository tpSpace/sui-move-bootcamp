import { SuiObjectResponse } from "@mysten/sui/client";

export interface Hero {
  id: string;
  health: string;
  stamina: string;
}

interface HeroContent {
  fields: {
    id: { id: string };
    health: string;
    stamina: string;
  };
}

/**
 * Parses the content of a hero object in a SuiObjectResponse.
 * Maps it to a Hero object.
 */
export const parseHeroContent = (objectResponse: SuiObjectResponse): Hero => {
  // Implement the function to parse the hero content
  const heroContent = objectResponse.data?.content as unknown as HeroContent;
  return {
    id: heroContent.fields.id.id,
    health: heroContent.fields.health,
    stamina: heroContent.fields.stamina,
  };
};
