import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


//convert prisma object into regular js object

export function convertToPlainObj <T> (value :T) : T {
  if (value === undefined) {
    throw new Error("Cannot convert undefined to plain object");
  }
  return JSON.parse(JSON.stringify(value));
}


//Format number with decimal places
export function formatNumberWithDecimal (num:number) :string{
 const [int , decimal]  =num.toString().split('.')
 return decimal?`${int}.${decimal.padEnd(2,'0')}` : `${int}.00`
}


//format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export  function formateError(error:any){
  if (error.name === 'ZodError'){
    //handle zod error
    const fieldErrors = Object.keys(error.errors).map((field)=>error.errors[field].message)
      
    return fieldErrors.join('. ')
  }else if(error.name ==='PrismaClientKnownRequestError' && error.code ==='P2002' ){
    const field = error.meta?.target ? error.meta.target[0] : 'Field'

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exist` 
  }else{
    //handle other error
    return typeof error.message === 'string' ? error.message:JSON.stringify(error.message)
  }
}

// round number to 2 decimal places
export function round2 (value :number | string){
  if (typeof value === 'number'){

   return Math.round((value + Number.EPSILON)*100)/100

  }else if(typeof value === 'string'){

    return Math.round((Number(value) + Number.EPSILON)*100)/100
  }else{
    throw new Error('value is not a number or string')
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-EG' ,{
  currency:"EGP",
  style:"currency",
  minimumFractionDigits:2
}

)

//formate currency using the formattor above
export function formateCurrency (amount : number | string | null){
  if(typeof amount === 'number'){
    return CURRENCY_FORMATTER.format(amount)
  }else if(typeof amount === 'string'){
    return CURRENCY_FORMATTER.format(Number(amount))
  }else{
    return 'NaN'
  }
}

//format number 
const NUMBER_FORMATTER =new Intl.NumberFormat('en-US')

export function formatNumber(number :number ){
  return NUMBER_FORMATTER.format(number)
}

//shorten UUID
export function formatId(id:string){
  return `..${id.substring(id.length-6)}`
}

//formate date and times 
export function formateDateTime  (dateString : Date) {
  const dateTimeOption :Intl.DateTimeFormatOptions={
    month:'short',  //Oct
    year:"numeric",  //2025
    day:"numeric",//25
    hour:'numeric', //8
    minute:'numeric', //30
    hour12:true //12-hour clock
  }

  const dateOptions :Intl.DateTimeFormatOptions ={
    weekday:'short', //Mon
    month:'short',  //Oct
    year:'numeric', //2023
    day:'numeric'  //25
  }

  const timeOptions :Intl.DateTimeFormatOptions ={
    hour:'numeric',
    minute:'numeric',
    hour12:true
  }

  const formattedDateTime :string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOption
  )

  const formattedDate :string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  )
  const formattedTime :string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  )

  return {
    dateTime:formattedDateTime,
    dateOnly:formattedDate,
    timeOnly:formattedTime
  }
}


//form the pagination links
export function formUrlQuery ({
  params,
  key,
  value
}:{params:string; key:string ; value:string|null}){

  //parse take params= page=1 and convert it into object {page:1} give me the current page i am on
  const query =qs.parse(params)

  query[key] = value  //when i am on page 2 and i click prev i get {page:1} even if it undedined in url

return  qs.stringifyUrl({
  url:window.location.pathname ,//user/orders
  query
},{
  skipNull:true
}
)

  
}