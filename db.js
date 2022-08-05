const { Pool, Client } = require('pg');

const _ = require('lodash');
const client = new Pool({
  host: 'ec2-52-43-109-39.us-west-2.compute.amazonaws.com',
  user: 'ubuntu',
});
const products = async (page = 1, count = 5) => {
  const { rows } = await client.query(
    'select * from products limit $1 offset $2;',
    [count, count * (page - 1)]
  );
  return rows;
};

const product = async (productId) => {
  const {
    rows: [product],
  } = await client.query('select * from products where id = $1 limit 1;', [
    productId,
  ]);
  const { rows: features } = await client.query(
    'select * from features where product_id = $1;',
    [productId]
  );
  product.features = features.map(({ feature, value }) => ({ feature, value }));
  return product;
};

const styles = async (productId) => {
  const { rows } = await client.query(
    'select * from styles where product_id = $1;',
    [productId]
  );
  const styles = await Promise.all(
    rows.map(async (style) => {
      let skus = (
        await client.query('select * from skus where style_id = $1;', [
          style.id,
        ])
      ).rows;
      let photos = (
        await client.query('select * from photos where style_id = $1;', [
          style.id,
        ])
      ).rows;
      style.skus = _.keyBy(
        skus.map(({ id, size, quantity }) => ({ id, size, quantity })),
        'id'
      );
      style.photos = photos.map(({ url, thumbnail_url }) => ({
        url,
        thumbnail_url,
      }));
      return style;
    })
  );
  return styles;
};

const related = async (productId) => {
  let related = (
    await client.query(
      'select * from related_products where product_id_left = $1;',
      [productId]
    )
  ).rows;
  return related.map(({ product_id_right }) => product_id_right);
};

module.exports = { products, product, styles, related };
