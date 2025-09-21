'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error);
    redirect(`/error?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error);
    redirect(`/error?error=${encodeURIComponent(error.message)}`);
  }

  // Check if email confirmation is required
  if (signUpData?.user && !signUpData.session) {
    // User needs to confirm their email
    redirect('/login?message=Check your email to confirm your account');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
