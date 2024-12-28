import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IMenuOption } from './interfaces/menu-option';
import { useMenu } from './menu-context';

export function useRegisterMenuOption(
  option: IMenuOption | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[] = [],
) {
  const { registerMenuOption } = useMenu();
  const location = useLocation();

  useEffect(() => {
    if (!option) {
      return;
    }
    if (option.routePattern && !option.routePattern.test(location.pathname)) {
      return;
    }

    const unregister = registerMenuOption(option);
    return () => unregister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, registerMenuOption, ...dependencies]);
}
