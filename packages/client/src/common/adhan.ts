import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';
import type { ValueOf } from 'adhan/lib/types/TypeUtils';
import dayjs, { Dayjs } from 'dayjs';


export const getPrayerTimes = (
	options: {
		date: Dayjs,
		coordinates: Coordinates,
		calculationMethod: keyof (typeof CalculationMethod),
		timeZone: string,
	}
): PrayerTimes => {
	const coordinates = new Coordinates(35.7897507, -78.6912485);
	const params = CalculationMethod[options.calculationMethod]();
	const date = options.date.toDate();
	const prayerTimes = new PrayerTimes(coordinates, date, params);
	return prayerTimes
}


export const getFormattedPrayerTimes = (
	prayerTimes: PrayerTimes,
) => {
	const formattedPrayerTimes: Record<string, Dayjs> = {};

	const prayersArr: ValueOf<typeof Prayer>[] = Object.values(Prayer);

	for (const [key, value] of Object.entries(prayerTimes)) {
		if(prayersArr.includes(key as ValueOf<typeof Prayer>)) {
			formattedPrayerTimes[key] = dayjs(value)
		}
	}

	return formattedPrayerTimes
}
