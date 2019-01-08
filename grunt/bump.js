/**
 * Created by cb5rp on 1/3/2017.
 */

module.exports = {
    options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Alpha v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: 'branch',
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
    }
};