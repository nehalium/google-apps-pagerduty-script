# google-apps-pagerduty-integration
Google Apps script to pull data from PagerDuty

## Installation

1. Pull code from repo
1. Create config.gs and paste the following contents:

```
var Config = {
  pagerduty: {
    url: 'https://api.pagerduty.com',
    token: 'INSERT API TOKEN',
    paths: {
      incidents: '/incidents'
    }
  }
};
```
