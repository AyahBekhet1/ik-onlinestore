export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "IK Store";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce store build with Next.js";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 6;

export const signInDefaultvalues = {
  email: "",
  password: "",
};

export const signUpDefaultvalues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
  phoneNumber: "",
};

export const PAYMENT_METHODS=process.env.PAYMENT_METHODS ?process.env.PAYMENT_METHODS.split(' '):['CashOnDelivery']

export const DEFAULT_PAYMENT_METHOD= process.env.DEFAULT_PAYMENT_METHOD

export const PAGE_SIZE =Number(process.env.PAGE_SIZE) || 10

export const productDefaultValues = {
  name:'',
  slug:'',
  category:'',
  images:[],
  brand:'',
  description:'',
  colors:[],
  price:'0',
  stock:0,
  rating:'0',
  numReviews:'0',
  isFeatured:false,
  banner:null,
}
export const categoryDefaultValues = {
  name:'',
  slug:'',
  images:[],
  description:'',
}

export const USER_ROLES = process.env.USERS_ROLES?process.env.USERS_ROLES.split(','):["admin","user"]
export const USER_CITY = process.env.USERS_CITY?process.env.USERS_CITY.split(','):["alexandria","cairo"]

export const CouponDefaultValues ={
  code:"",
  discountType:'',
  discount:0,
  maxUses:0,
  uses:0,
  expiresAt:new Date()
}

export const DISCOUNT_TYPE = process.env.DISCOUNT_TYPE? process.env.DISCOUNT_TYPE.split(','):["percentage" , 'fixed']
