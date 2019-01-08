/**
 * Created by cb5rp on 1/4/2017.
 */

module.exports = {
    'default': ['jshint', 'sloc:e2e-tests', 'notify'],
    'deploy': ['jshint', 'sloc:e2e-tests', 'bump', 'notify']
};