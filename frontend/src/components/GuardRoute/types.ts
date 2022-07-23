export interface IGuardRouteProps {
    canActivate: boolean;
    redirectTo: string;
    children: JSX.Element;
    onSuccess?: () => void
  }
  