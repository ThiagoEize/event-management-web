import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface EventSearchContextType {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearchTerm: string;
  setDebouncedSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  searchField: string;
  setSearchField: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number | undefined;
  setLimit: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface EventSearchProviderProps {
  children: ReactNode;
}

const EventSearchContext = createContext<EventSearchContextType | undefined>(
  undefined
);

export const EventSearchProvider: React.FC<EventSearchProviderProps> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [orderBy, setOrderBy] = useState("event asc");
  const [searchField, setSearchField] = useState("event");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number | undefined>();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1200);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  return (
    <EventSearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        debouncedSearchTerm,
        setDebouncedSearchTerm,
        orderBy,
        setOrderBy,
        searchField,
        setSearchField,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
      }}
    >
      {children}
    </EventSearchContext.Provider>
  );
};

export const useEventSearchContext = (): EventSearchContextType => {
  const context = useContext(EventSearchContext);
  if (!context) {
    throw new Error(
      "useEventSearchContext must be used within an EventSearchProvider"
    );
  }
  return context;
};
