import { ReactNode } from 'react';
import { IncludeOnMenu } from '../enumerations/include-on-menu';

export interface IMenuOption {
  /**
   * Unique identifier for the menu option
   */
  id: string;
  /**
   * Text to display for the menu option
   */
  label: string;
  /**
   * Where the menu option should be displayed
   */
  includeOnMenus: IncludeOnMenu[];
  /**
   * Display order for the menu option. Lower numbers are displayed first.
   */
  index: number;
  /**
   * Whether the menu option is a divider
   */
  divider?: boolean;
  /**
   * Icon to display for the menu option
   */
  icon?: ReactNode;
  /**
   * Link to navigate to when the menu option is clicked
   * Mutually exclusive with `action`
   */
  link?: string;
  /**
   * Function to execute when the menu option is clicked
   * Mutually exclusive with `link`
   * @returns void
   */
  action?: () => void;
  /**
   * Whether the menu option requires authentication
   * true = requires authentication
   * false = requires unauthenticated
   * undefined = always show
   */
  requiresAuth: boolean;
  /**
   * Route pattern to match for the menu option
   */
  routePattern?: RegExp;
  /**
   * Custom filter function to determine if the menu option should be displayed
   * @param option - The menu option to filter
   * @returns boolean
   */
  filter?: (option: IMenuOption) => boolean;
}
