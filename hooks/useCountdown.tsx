import { useEffect, useState } from 'react';

const useCountdown = (targetDate: Date) => {
	const countDownDate = new Date(targetDate).getTime();

	const [countDown, setCountDown] = useState<number>(countDownDate - new Date().getTime());

	let interval: any;
	useEffect(() => {
		interval = setInterval(() => {
			setCountDown(countDownDate - new Date().getTime());
		}, 1000);

		return () => clearInterval(interval);
	}, [countDownDate]);

	useEffect(() => {
		if ((countDown == 0 || countDown < 0) && interval !== undefined) {
			clearInterval(interval);
		}
	}, [countDown, interval]);

	return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
	const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
	return [seconds];
};

export { useCountdown };
