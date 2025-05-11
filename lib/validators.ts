import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";


const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "price must have two decimal places"
  );

//schema for inserting pdts
export const insertProductSchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters"),
  slug: z.string().min(3, "slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  colors: z.array(z.string()).optional(),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

//schema for inserting categories
export const insertCategorySchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters"),
  slug: z.string().min(3, "slug must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
});


//schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "id is required"),
});

//Schema for updating cAtegory
export const updateCategorySchema = insertCategorySchema.extend({
  id: z.string().min(1, "id is required"),
});
//schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

//schema for signing user up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 charactrs"),
    email: z.string().email("invalid email address"),
    password: z.string().min(6, "password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

//Cart Schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  color:z.string(),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

//schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "name must be at least 3 characters"),
  phoneNumber: z
    .string()
    .regex(/^\+?\d?[\d\s-]{11,14}$/, "Invalid phone number format"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "city must be at least 3 characters"),
  postalCode: z.string().min(3, "postal code must be at least 3 characters"),
  country: z.string().min(3, "country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

//schema for payment method

export const PaymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment Method is Required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid Payment Method",
  });

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

//schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(3, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  totalPrice: currency,
  totalPriceAfterDisc:currency.optional(),
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

//schema for inserting order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

//schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "name mst be at least three characters"),
  email: z.string().min(3, "email mst be at least three characters").email(),
});
export const updateProfilePassswordSchema=updateProfileSchema.extend({
  password: z.string().min(6, "password must be at least 6 characters"),
})
//schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "id is required"),
  role: z.string().min(1, "Role is required"),
});


//create coupon
export const insertCouponSchema = z.object({
  code:z.string().min(3,"code must be at least 3 characters"),
  discountType:z.string(),
  discount:z.number(),
  maxUses:z.number(),
  uses:z.number(),
  expiresAt:z.preprocess((val)=>{
    if (typeof val ==='string' && val !== ''){
      return new Date(val)
    }
    return null
  },z.date().nullable().refine((date)=>{
    if(date === null) return true
    return date > new Date()
  },{message:"Expiration date must be in the future"}

 ))

})

export const updateCouponSchema = insertCouponSchema.extend({
  id: z.string().min(1, "id is required"),
});

export const insertCouponApplySchema = z.object({
  code:z.string()
})