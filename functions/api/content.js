import { getPortfolioContent } from "../_lib/content";
import { json } from "../_lib/http";

export const onRequestGet = async () => json(getPortfolioContent());
