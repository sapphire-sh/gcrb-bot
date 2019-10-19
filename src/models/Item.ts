import {
	PlatformType,
} from '~/constants';

export interface Item {
	id: string;
	date: string;
	title: string;
	platform: PlatformType;
	applicant: string;
	rating: number;
	code: string;
	tweet: number;
}
