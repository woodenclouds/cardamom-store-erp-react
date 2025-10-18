import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const location = useLocation();
  const previousLocation = useRef(location.pathname);

  useEffect(() => {
    console.log('Navigation changed from', previousLocation.current, 'to', location.pathname);
    previousLocation.current = location.pathname;
  }, [location.pathname]);

  return {
    currentPath: location.pathname,
    previousPath: previousLocation.current,
  };
};
