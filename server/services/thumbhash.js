'use strict';

module.exports = ({ strapi }) => ({
  async generateThumbhash(url, populateDataURIs) {
    const port = strapi.config.server.port;
    const host = strapi.config.server.host;
    const baseUrl = `http://${host}:${port}`;
    try {
      const result = calculateThumbhash(baseUrl + url, populateDataURIs);
      return result;
    } catch (e) {
      return {
        thumbHash: "",
        dataURI: "",
      };
    }
  },
});

const binaryToBase64 = binary => btoa(String.fromCharCode(...binary))

async function calculateThumbhash(url, populateDataURIs) {
  const { rgbaToThumbHash, thumbHashToDataURL } = await import('thumbhash');
  const { Image } = await import('image-js');
  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
  const buffer = await fetch(url).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );


  let thumbhash = "";
  let dataURI = "";

  try {
    let image = await Image.load(buffer);
    const { width: w, height: h } = image;
    if (w > h) {
      image = image.resize({ width: 96 });
    }
    else {
      image = image.resize({ height: 96 });
    }
    const { width, height, data } = image.rgba8();

     thumbhash = rgbaToThumbHash(width, height, data);
     dataURI = populateDataURIs ? thumbHashToDataURL(thumbhash) : void 0;
  }
  catch (_) {
  }

  return { thumbHash: thumbhash ? binaryToBase64(thumbhash): "", dataURI };
}
