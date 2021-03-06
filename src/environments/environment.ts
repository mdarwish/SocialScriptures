// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  ELK_HOST: 'localhost',
  ELK_PORT: '9200',
  ELK_URL: "http://localhost:9200"
};

//staging
/* 
export const environment = {
  production: false,
  ELK_HOST: 'cloudunity-1465550503.us-east-1.bonsaisearch.net',
  ELK_PORT: '80',
  ELK_URL: "https://3wzd48do66:y3ramp4bp6@cloudunity-1465550503.us-east-1.bonsaisearch.net"
};
 */

//prod
/* 
export const environment = {
  production: false,
  ELK_HOST: '4fd24d26c7454e18b5a8bbc075165712.us-central1.gcp.cloud.es.io',
  ELK_PORT: '9243',
  ELK_URL: "https://elastic:Xx9vKTTwUbNOT2iM4i8nSuEf@4fd24d26c7454e18b5a8bbc075165712.us-central1.gcp.cloud.es.io:9243"
};
 */