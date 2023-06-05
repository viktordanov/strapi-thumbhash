'use strict';

module.exports = ({ strapi }) => {

  const generateThumbhash = async (event, eventType) => {
    const { data, where } = event.params;

    const regenerateOnUpdate = strapi.plugin('strapi-thumbhash').config('regenerateOnUpdate') === true;
    const populateDataURIs = strapi.plugin('strapi-thumbhash').config('populateDataURIs') === true;

    if (data.mime && data.mime.startsWith('image/')) {
      const { thumbHash, dataURI } = await strapi.plugin('strapi-thumbhash').service('thumbhash').generateThumbhash(data.url, populateDataURIs);
      data.thumbHash = thumbHash;
      data.thumbHashURI = dataURI;
    }

    if (eventType === 'beforeUpdate' && regenerateOnUpdate) {
      const fullData = await strapi.db.query('plugin::upload.file').findOne({
        select: ['url', 'thumbHash', 'name', 'mime'],
        where
      })

      if ((fullData.mime && fullData.mime.startsWith('image/')) && !fullData.thumbHash) {
        const { thumbHash, dataURI } = await strapi.plugin('strapi-thumbhash').service('thumbhash').generateThumbhash(data.url, populateDataURIs);
        data.thumbHash = thumbHash;
        data.thumbHashURI = dataURI;
      }
    }
  };

  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    beforeCreate: (event) => generateThumbhash(event, 'beforeCreate'),
    beforeUpdate: (event) => generateThumbhash(event, 'beforeUpdate'),
  });
};
