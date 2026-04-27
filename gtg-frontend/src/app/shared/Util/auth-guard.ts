import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../../components/login/auth.service";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const authService = inject(AuthService);
	return authService.getHasIdToke();
};
