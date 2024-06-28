import { useEffect, useState } from 'react';

import {
  useApi,
  reactExtension,
  Text,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

const variantId = 'gid://shopify/ProductVariant/48096216711487'

function Extension() {
  const { query } = useApi();

  interface VariantData {
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    }
    image?: {
      url: string;
      altText: string;
    }
    product: {
      title: String;
      featuredImage?: {
        url: string;
        altText: string;
      }
    }
  }

  const [variantData, setVariantData] = useState<null | VariantData>(null)

  useEffect(() => {
    async function getVariantData() {
      // this query search any node for this ID, however we specify that we only want it to query ProductVariants
      const queryResult = await query<{ node: VariantData }>(`{
          node(id: "${variantId}"){
            ... on ProductVariant {
              title
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              product {
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }`)
      console.log(queryResult);

      if (queryResult.data) {
        setVariantData(queryResult.data.node)
      }
    }

    getVariantData();
  }, [])

  if (!variantData) {
    return null;
  } else {
    return (
      <Text
        size='large'
        emphasis='bold'
        appearance='success'
      >
        Nice selection on the: {variantData.title}.
      </Text>
    );
  }
}