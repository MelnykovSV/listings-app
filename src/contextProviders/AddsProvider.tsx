import { ReactElement, createContext, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';

interface IBorderCoordinates {
  minLat: number | null;
  maxLat: number | null;
  minLon: number | null;
  maxLon: number | null;
}

interface IAddsContext {
  adds: any[];
  coordinatesHandler: (coordinatesData: IBorderCoordinates) => void;
}

interface IAddsProviderProps {
  children: ReactElement | ReactElement[];
}

export const AddsContext = createContext<IAddsContext>({} as IAddsContext);

export function AddsProvider({ children }: IAddsProviderProps) {
  const [adds, setAdds] = useState([]);
  const [coordinates, setCoodinates] = useState<IBorderCoordinates>({
    minLat: null,
    maxLat: null,
    minLon: null,
    maxLon: null,
  });

  console.log(coordinates);

  useEffect(() => {
    const { minLat, maxLat, minLon, maxLon } = coordinates;
    (async () => {
      if (minLat && maxLat && minLon && maxLon) {
        const response = await axios.get(
          `https://add-app-backend-w6gc.onrender.com/adds?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}`,
        );

        setAdds(response.data.data.adds);
      }
    })();
  }, [coordinates]);

  const coordinatesHandler = useCallback((coordinatesData: IBorderCoordinates) => {
    setCoodinates(coordinatesData);
  }, []);

  const contextValue = useMemo(() => ({ adds, coordinatesHandler }), [adds, coordinatesHandler]);

  return <AddsContext.Provider value={contextValue}>{children}</AddsContext.Provider>;
}
