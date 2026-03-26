import { useEffect, useState } from "react";
import defaultContent from "../content/portfolio-content.json";

const API_URL = "/api/content";

export const usePortfolioContent = () => {
  const [content, setContent] = useState(defaultContent);
  const [status, setStatus] = useState({
    isLoading: true,
    source: "local",
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        setContent(payload);
        setStatus({
          isLoading: false,
          source: "api",
          error: "",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatus({
          isLoading: false,
          source: "local",
          error: error instanceof Error ? error.message : "No se pudo cargar la API.",
        });
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    content,
    ...status,
  };
};
