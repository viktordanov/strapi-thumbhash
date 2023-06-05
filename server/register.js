'use strict';

module.exports = ({ strapi }) => {
  strapi.plugin('upload').contentTypes.file.attributes.thumbHash = {
    type: 'text',
  };
  strapi.plugin('upload').contentTypes.file.attributes.thumbHashURI = {
    type: 'text',
    required: false
  }
};
