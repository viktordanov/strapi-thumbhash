# Strapi plugin strapi-thumbhash

**This plugin is a fork of [Strapi blurhash](https://github.com/emil-petras/strapi-blurhash) to implement the superior[^1] [Thumbhash](https://evanw.github.io/thumbhash/) in lieu of blurhashes.**
The plugin is 

[^1]: Personal opinion. 

A plugin for <a href="https://github.com/strapi/strapi">Strapi CMS</a> that generates thumbhash for your uploaded images

## Installation

To install, run:

```bash
npm install strapi-thumbhash
```

Open/create file `config/plugins.js`. Enable this plugin by adding:

```js
export default ({ env }) => ({
  'strapi-thumbhash': {
    enabled: true,
    config: {
      regenerateOnUpdate: true, // default
      populateDataURI: false    // default
    }
  },
});
```

`populateDataURI` will add a `thumbHashURI` field to the image object. This is useful when you don't to generate the thumbhash on the client side at the cost of increased payload size and data usage. Since this is optional, the field is nullable on the image payloud.

`regenerateOnUpdate` will regenerate the thumbhash when the image is updated. This is useful when you want to update the thumbhash when the image is edited.

## How to generate thumbhash for an image

In the Strapi Dashboard open Content Manager. Edit one collection/single type. Add or edit a Media field type and save the collection/single type.

## How to get thumbHash

Target a Strapi REST API endpoint. For example:

```
localhost:1337/api/products?populate=Image.*
```

The response will be a JSON containing thumbhash along with rest of the image data:

```js
{
  "data": [
    {
      "id": 6,
      "attributes": {
        "name": "Test",
        "createdAt": "2022-10-27T14:52:04.393Z",
        "updatedAt": "2022-10-28T09:58:22.238Z",
        "Image": {
          "data": {
            "id": 80,
            "attributes": {
              "name": "image.png",
              "alternativeText": "image.png",
              "caption": "image.png",
              "width": 960,
              "height": 168,
              "formats": {
                ...
              },
              "hash": "image_ed1fbcdba0",
              "ext": ".png",
              "mime": "image/png",
              "size": 4.63,
              "url": "/uploads/image_ed1fbcdba0.png",
              "previewUrl": null,
              "provider": "local",
              "provider_metadata": null,
              "createdAt": "2022-10-28T09:42:02.471Z",
              "updatedAt": "2022-10-28T09:42:02.471Z",
              "thumbHash": "1QcSHQRnh493V4dIh4eXh1h4kJUI"
              "thumbHashURI": null, // or "data:image/png;base64, ..."
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```
