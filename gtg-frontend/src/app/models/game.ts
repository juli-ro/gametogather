import { ILookupBase } from "./lookupBase";

export interface IGame extends ILookupBase {
	minPlayerNumber: number;
	maxPlayerNumber: number;
	playTime: number;
	minAge: number;
	yearPublished: number;
}
