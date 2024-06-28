import type {
  RunInput,
  FunctionRunResult,
  Target,
  ProductVariant
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type Configuration = {};

export function run(input: RunInput): FunctionRunResult {
  // filter the results of cart.lines and return an array of objects with a ProductVariant id, then pass to the discounts function targets array.
  const targets: Target[] = input.cart.lines
    .filter(line => {
        if (line.merchandise.__typename === "ProductVariant") {
          const hasLimitedEditionTag = line.merchandise.product.hasAnyTag;
          // if this variant doesn't have the 'Limited Edition' tag, return true.
          return hasLimitedEditionTag === false;
        }
      }
    ).map(line => {
      return {
        productVariant: {
          // because line.merchandise is a union of two possible types, we let TypeScript know this will be of the type ProductVariant.
          id: (line.merchandise as ProductVariant).id 
        }
      }
    });
  
  const DISCOUNTED_ITEMS: FunctionRunResult = {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [
      {
        targets: targets,
        value: {
          percentage: {
            value: 10 
          }
        },
        message: "10% OFF"
      }
    ]
  }
  return targets.length === 0 ? EMPTY_DISCOUNT : DISCOUNTED_ITEMS;
};