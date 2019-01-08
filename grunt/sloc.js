/**
 * Created by cb5rp on 1/3/2017.
 */

module.exports = {
    options: {
        reportType: 'stdout',
        reportDetail: false,
        tolerant: false
    },
    'e2e-tests': {
        files: {
            'tests': [
                '**.js',
                '**/**.js',

            ]
        }
    }
};