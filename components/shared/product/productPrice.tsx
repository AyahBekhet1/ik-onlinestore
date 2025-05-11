import { cn } from "@/lib/utils";


export default function ProductPrice({value , className}:{value:number ; className?:string}) {

    const stringvalue = value.toFixed(2)
    const [intValue , floatValue ] =stringvalue.split('.')
  return (
    <p className={cn('text-2xl' , className)}>
      <span className="">{intValue}</span>

      <span>{`.${floatValue} `}</span>
      <span>LE</span>
    </p>
  )
}
