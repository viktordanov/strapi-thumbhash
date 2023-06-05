'use strict';


const { rgbaToThumbHash, thumbHashToDataURL } = require('thumbhash');

module.exports = ({ strapi }) => ({
  async generateThumbhash(url, populateDataURIs) {
    try {
      return await calculateThumbhash(url, populateDataURIs);
    } catch (e) {
      strapi.log.error(e);
      return {
        thumbHash: null,
        dataURI: null,
      };
    }
  },
});

async function calculateThumbhash(url, dataURI) {
  const buffer = await fetch(url).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  let image = await Image.load(buffer);
  const {w, h} = image;
  if (w > h) {
    image = image.resize({width: 96});
  }
  else {
    image = image.resize({height: 96});
  }
  const { width, height, data} = image.rgba8();

  const thumbhash = rgbaToThumbHash(width,height,data);
  const dataURL = dataURI ?  thumbHashToDataURL(thumbhash): void 0;
  return {thumbhash, dataURL};
}
