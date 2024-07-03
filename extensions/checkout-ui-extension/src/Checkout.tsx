import { useEffect, useState } from 'react';

import {
  useApi,
  reactExtension,
  Text,
  InlineLayout,
  Checkbox,
  Image,
  BlockStack,
  Pressable,
  Heading,
  BlockSpacer,
  Divider,
  useCartLines,
  useApplyCartLinesChange,
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
  // Clicking anywhere within the Pressable component will toggle the value of this hook. Checkbox will consume the value.
  const [isSelected, setIsSelected] = useState(false)

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

  const cartLines = useCartLines();
  const applyCartLineChange = useApplyCartLinesChange();

  useEffect(() => {
    // Add Selected item to cart
    if (isSelected) {
      applyCartLineChange({
        type: 'addCartLine',
        quantity: 1,
        merchandiseId: variantId
      });
    } else {
      // Find item in cart
      const cartLineId = cartLines.find(
        cartLine => cartLine.merchandise.id === variantId
      )?.id;
      // Remove item from cart
      if (cartLineId) {
        applyCartLineChange({
          type: 'removeCartLine',
          id: cartLineId,
          quantity: 1
        });
      }
    }
  }, [isSelected])

  if (!variantData) return null;
  
  return (
    <>
      <Divider />
      <BlockSpacer spacing={"base"}/>
      <Heading level={2}>
        Other Products You May Like
      </Heading>
      <BlockSpacer spacing={"base"}/>
      <Pressable onPress={() => setIsSelected(!isSelected)}> {/* a wrapper to add onClick functionality to it's children */}
        <InlineLayout 
          blockAlignment="center"
          spacing={["base", "base"]}
          columns={["auto", 80, "fill"]}  
          padding="base"
        > {/* like a flex-box container */}
          <Checkbox checked={isSelected} />
          <Image
            source={variantData.image?.url || variantData.product.featuredImage?.url}
            accessibilityDescription={variantData.image?.altText || variantData.product.featuredImage?.altText}
            borderRadius="base"
            border="base"
            borderWidth="base"
          />
          <BlockStack>
            <Text>
              {variantData.product.title} - {variantData.title}
            </Text>
            <Text>
              {variantData.price.currencyCode} {variantData.price.amount}
            </Text>
          </BlockStack>
        </InlineLayout>
      </Pressable>
    </>
  );
}