const db = require('./db');

describe('database', () => {
  it('retrieves the right data for products', async () => {
    const products = await db.products(1, 5);
    expect(products[0].id).toBe(1);
  });
  it('retrieves the right data for product', async () => {
    const product = await db.product(1);
    expect(product.features.length).toBe(2);
  });

  it('retrieves the right data for styles', async () => {
    const styles = await db.styles(1);
    expect(styles.length).toBe(6);
  });
  it('retrieves the right data for related', async () => {
    const related = await db.related(1);
    expect(related.length).toBe(4);
  });
});
