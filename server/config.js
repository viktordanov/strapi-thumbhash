'use strict';

module.exports = {
    default: ({ env }) => ({ regenerateOnUpdate: false, populateDataURIs: false }),
    validator: (config) => {
        if (typeof config.regenerateOnUpdate !== 'boolean') {
            throw new Error('regenerateOnUpdate has to be a boolean');
        }
        if (typeof config.populateDataURIs !== 'boolean') {
            throw new Error('populateDateURIs has to be a boolean');
        }
    },
};
