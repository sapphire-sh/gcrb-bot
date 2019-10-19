export const BASE_URL = 'http://www.grac.or.kr/Statistics/GameStatistics.aspx';
export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';
export const DATE_RANGE = 10;
export enum PlatformType {
	PC = '01',
	CONSOLE = '03',
	MOBILE = '04',
	ARCADE = '05',
}
export const RATINGS = [
	'rating_all',
	'rating_12',
	'rating_15',
	'rating_18',
	'icon_reject',
	'icon_cancel1',
	'icon_cancel2',
];

export const PLATFORM_STRINGS = {
	'01': 'PC/온라인 게임',
	'03': '비디오 게임',
	'04': '모바일 게임',
	'05': '아케이드 게임',
};
export const RATING_STRINGS = [
	'전체이용가',
	'12세 이용가',
	'15세 이용가',
	'청소년 이용불가',
	'등급거부',
	'등급취소예정',
	'등급취소',
];
