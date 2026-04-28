import { HttpInterceptorFn } from "@angular/common/http";
import { jwtEnum } from "../jwtEnum";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const token: string | null = localStorage.getItem(jwtEnum.id_token);

	if (token) {
		const clonedRequest = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return next(clonedRequest);
	}
	return next(req);
};
