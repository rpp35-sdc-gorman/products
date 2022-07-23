import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.0.0/index.js';

// Custom metrics
// We instantiate them before our main function
let checkFailureRate = new Rate('check_failure_rate');
let timeToFirstByte = new Trend('time_to_first_byte', true);
// export const options = {
//   vus: 1,
//   duration: '1m',
// };
/* Main function
The main function is what the virtual users will loop over during test execution.
*/
export default function () {
  // group('Product', function () {
  //   const res = http.get(
  //     'http://localhost:5000/products/' + randomIntBetween(10000, 100000)
  //   );
  //   let checkRes = check(res, {
  //     'Keys present': (r) => r.body.indexOf('"description":') !== -1,
  //   });

  //   // Record check failures
  //   checkFailureRate.add(!checkRes);

  //   // Record time to first byte and tag it with the URL to be able to filter the results in Insights
  //   timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });
  // });

  group('Styles', function () {
    const res = http.get(
      'http://localhost:5000/products/' +
        randomIntBetween(10000, 100000) +
        '/styles'
    );
    let checkRes = check(res, {
      'Keys present': (r) => r.body.indexOf('"thumbnail_url":') !== -1,
    });

    // Record check failures
    checkFailureRate.add(!checkRes);

    // Record time to first byte and tag it with the URL to be able to filter the results in Insights
    timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });
  });

  // group('Related', function () {
  //   const res = http.get(
  //     'http://localhost:5000/products/' +
  //       randomIntBetween(10000, 100000) +
  //       '/related'
  //   );
  //   let checkRes = check(res, {
  //     'Keys present': (r) => r.body.indexOf('[') !== -1,
  //   });
  //   checkFailureRate.add(!checkRes);
  //   timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });
  // });

  sleep(10);
}
