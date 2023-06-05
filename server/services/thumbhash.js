'use strict';

module.exports = ({ strapi }) => ({
  async generateThumbhash(url, populateDataURIs) {
    const port = strapi.config.server.port;
    const host = strapi.config.server.host;
    const baseUrl = `http://${host}:${port}`;
    try {
      return calculateThumbhash(baseUrl + url, populateDataURIs);
    } catch (e) {
      strapi.log.error(e);
      return {
        thumbHash: "error",
        dataURI: "error",
      };
    }
  },
});

const binaryToBase64 = binary => btoa(String.fromCharCode(...binary))
const base64ToBinary = base64 => new Uint8Array(atob(base64).split('').map(x => x.charCodeAt(0)))

async function calculateThumbhash(url, dataURI) {
  const { rgbaToThumbHash, thumbHashToDataURL } = await import('thumbhash');
  const { Image } = await import('image-js');
  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
  const buffer = await fetch(url).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  let image = await Image.load(buffer);
  const { width: w, height: h } = image;
  if (w > h) {
    image = image.resize({ width: 96 });
  }
  else {
    image = image.resize({ height: 96 });
  }
  const { width, height, data } = image.rgba8();

  const thumbhash = rgbaToThumbHash(width, height, data);
  const dataURL = dataURI ? thumbHashToDataURL(thumbhash) : void 0;
  return { thumbHash: binaryToBase64(thumbhash), dataURL };
}
