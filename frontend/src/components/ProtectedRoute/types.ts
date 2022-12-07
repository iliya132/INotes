export interface IProtectedRouteProps {
    isAuth: boolean;
    children: JSX.Element;
    redirectTo?: String; 
}
