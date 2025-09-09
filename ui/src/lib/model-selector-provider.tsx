"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ModelSelectorContextType = {
  model: string;
  setModel: (model: string) => void;
  agent: string;
  lgcDeploymentUrl?: string | null;
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

const ModelSelectorContext = createContext<
  ModelSelectorContextType | undefined
>(undefined);

export const ModelSelectorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [model, setModelState] = useState("openai");
  const [lgcDeploymentUrl, setLgcDeploymentUrl] = useState<string | null>(null);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const modelParam = url.searchParams.get("coAgentsModel") ?? "openai";
    const lgcUrlParam = url.searchParams.get("lgcDeploymentUrl");

    setModelState(modelParam);
    setLgcDeploymentUrl(lgcUrlParam);
  }, []);

  const setModel = (model: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("coAgentsModel", model);
    window.location.href = url.toString(); // Trigger full page reload
  };

  const agent =
    model === "google_genai"
      ? "research_agent_google_genai"
      : model === "crewai"
      ? "research_agent_crewai"
      : "research_agent";

  return (
    <ModelSelectorContext.Provider
      value={{ model, setModel, agent, lgcDeploymentUrl, hidden, setHidden }}
    >
      {children}
    </ModelSelectorContext.Provider>
  );
};

export const useModelSelectorContext = () => {
  const context = useContext(ModelSelectorContext);
  if (context === undefined) {
    throw new Error(
      "useModelSelectorContext must be used within a ModelSelectorProvider"
    );
  }
  return context;
};
