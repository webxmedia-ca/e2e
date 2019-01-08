# Automated e2e Tests
testing selenium js / mocha + docker + etc...


This repo defines the automated tests suites for OneStop.  The git url is: https://bitbucket.aer.ca/scm/on/e2e.git


# Dependencies

### Package installations

run `npm install` to install and packages.  Optionally, you can run npm update to update your npm packages if required.

# Running scripts

the tests can be run by by using an `npm run` command within the scripts section of [package.json](./package.json)

the usage is `npm run <script name> -- --env=xxx` where xxx can be dev, tst, uat or tra.

i.e.: to run the pipeline baseline script in TST would be: `npm run e2e:application:pipeline-baseline -- -- env=tst`

Optionally, you can pass a --username and --password values if you want to run as a non-default user. 

# Grunt

There are 3 grunt tasks in this repo.

1. `grunt`: runs a line of code count and jshint
2. `grunt jshint`: runs jshint alone.
3. `grunt deploy`: runs sloc, jshint and deploys to git while incrementing the semantic versioning number