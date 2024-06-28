import type {
  RunInput,
  FunctionRunResult,
  ProductVariant
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

const MIN_UNIQUE_PRODUCTS = 2;
const DISCOUNT_PER_PRODUCT = 5;
const MAX_DISCOUNT = 20;

export function run(input: RunInput): FunctionRunResult {
  // get product IDs
  const uniqueProducts = input.cart.lines.reduce((productIds, line) => {
    productIds.add((line.merchandise as ProductVariant).product.id)
    
    return productIds;
  }, new Set<string>())

  if (uniqueProducts.size < MIN_UNIQUE_PRODUCTS) {
    return EMPTY_DISCOUNT;
  } else {
    const discount = Math.min(uniqueProducts.size * DISCOUNT_PER_PRODUCT, MAX_DISCOUNT);
    const uniqueDiscountProducts = discount / DISCOUNT_PER_PRODUCT;

    return {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          message: `${discount}% off for buying ${uniqueDiscountProducts} unique products`,
          value: {
            percentage: {
              value: discount
            }
          },
          targets: [
            {
              orderSubtotal: { // only targeting subtotal
                excludedVariantIds: [] // not excluding any variants
              }
            }
          ]
        }
      ]
    }
  }

  return EMPTY_DISCOUNT;
};