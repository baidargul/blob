export const PRODUCT_FORMAT_FOR_REPORT = (data: any) => {
  const productId = data.product?.id;
  const barcodeRegisterId = data?.id;
  const name = data.product?.name;
  const barcode = data?.barcode;
  const color = data?.color;
  const cost = data?.cost;
  const invoice = data?.invoice;
  const soldAt = data?.soldAt;
  const type = { id: data?.product?.type?.id, name: data?.product?.type?.name };
  const category = {
    id: data?.product?.category?.id,
    name: data?.product?.category?.name,
  };
  const brand = {
    id: data?.product?.brand?.id,
    name: data?.product?.brand?.name,
  };
  const sale = {
    id: data.sale?.id,
    account: data?.sale?.account,
    customer: data?.sale?.account?.customer,
  };
  const purchase = {
    id: data?.purchase.id,
    account: data?.purchase?.account,
    vendor: data?.purchase?.account?.vendor,
  };

  let images = [];
  if (data?.product?.productImages?.length > 0) {
    for (const image of data?.product?.productImages) {
      images.push(image.images);
    }
  }

  const product = {
    id: productId,
    barcodeRegisterId,
    name,
    barcode,
    color,
    cost,
    invoice,
    soldAt,
    type,
    category,
    brand,
    sale,
    purchase,
    images,
  };

  console.log(product);

  return product;
};
