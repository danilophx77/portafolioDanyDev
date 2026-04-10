import { getPortfolioContent } from "../_lib/content";
import { json } from "../_lib/http";

export const onRequestGet = async () => {
  const content = getPortfolioContent();

  return json({
    capabilities: content.capabilities,
    skillMatrix: content.skillMatrix,
    workflow: content.workflow,
  });
};
