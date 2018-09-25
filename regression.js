'use strict';

const DataSource = require('loopback-datasource-juggler').DataSource;
const config = require('rc')('loopback', {dev: {mongodb: {}}}).dev.mongodb;
const ds = new DataSource(require('.'), config);
const EmbWithBuffer = ds.createModel('embWithBuffer', {
  imageId: 'string',
  rawImage: {
    type: 'buffer',
    required: true,
  },
});
const TestEntity = ds.createModel('testEntity', {
  myMetadata: {
    type: {
      title: 'string',
      innerBuffer: {
        type: 'embWithBuffer',
      }
    },
  },
  embeddedWithBuffer: {
    type: 'embWithBuffer',
  },
});
const buf = [255, 216, 255, 224, 0, 16, 74, 70, 73];

ds.once('connected', async () => {
  console.log('connected');
  const createdModel = await TestEntity.create({
    myMetadata: {
      title: 'demo title',
      innerBuffer: {
        imageId: 'IMG_ID_INNER',
        rawImage: Buffer.from(buf),
      }
    },
    embeddedWithBuffer: {
      imageId: 'IMG_ID',
      rawImage: Buffer.from(buf),
    },
  });

  const retrievedModel = await TestEntity.findById(createdModel.id);
  console.log(retrievedModel.toJSON());
});