import {interval, Observable, Subscription} from 'rxjs';
import {losslessThrottle} from 'rxjs-lossless-throttle';
import {throttleTime} from "rxjs/operators";

export enum ThrottlingStrategy {
  LOSSY,
  LOSSLESS,
  BUFFERED,
  NONE
}

export const startSubscription = (strategy: ThrottlingStrategy, next: (value: number) => void): Subscription => {
  let source: Observable<number>;

  switch (strategy) {
    case ThrottlingStrategy.LOSSY:
      source = interval(200).pipe(
        throttleTime(1000)
      );
      break;
    case ThrottlingStrategy.LOSSLESS:
      source = interval(200).pipe(
        losslessThrottle<number>(1000, 500)
      );
      break;
    case ThrottlingStrategy.BUFFERED:
      source = interval(200).pipe(
        losslessThrottle<number>(1000, 500, 4)
      );
      break;
    case ThrottlingStrategy.NONE:
      source = interval(200).pipe();
      break;
  }

  return source.subscribe(next);
};
