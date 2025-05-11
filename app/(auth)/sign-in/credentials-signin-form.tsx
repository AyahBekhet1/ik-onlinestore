"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultvalues } from "@/lib/constants";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";

export default function CredentialSigninForm() {

  const [data , action] = useActionState(signInWithCredentials , {
    success:true,
    message:''
  }) 

  const searchParams = useSearchParams();
  const callbackUrl =searchParams.get('callbackUrl') || '/'
  

  const SignInButton =()=>{
    const {pending} = useFormStatus()

    return(
      <Button disabled={pending} className="w-full rounded-full" variant='default'>
        {pending? 'SIGNING IN ...' : 'SIGN IN'}
      </Button>
    )
  }

  return (
    <form action={action}>
      <input type="hidden"  name="callbackUrl" value={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            defaultValue={signInDefaultvalues.email}
          />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='password'
            defaultValue={signInDefaultvalues.password}
          />
        </div>
        <div>
          <SignInButton />
        </div>
        {
          data && !data.success && (
            <div className="text-center text-destructive">
              {data.message}
            </div>
          )
        }
        
      </div>

     
    </form>
  );
}
