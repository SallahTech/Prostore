"use server"

import {signInFormSchema, signUserFormSchema} from "@/lib/validators";
import {signIn, signOut} from '@/auth'

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {prisma} from "@/db/prisma";
import {formatErrors} from "@/lib/utils";
import {hash} from "@/lib/encryp";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        })

        await signIn('credentials', user)

        return {
            success: true,
            message: "Signed in successfully",
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            success: false,
            message: "Invalid email or password",
        }
    }
}

// sign user out
export async function signOutUser() {
    await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUserFormSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
            name: formData.get("name"),
            confirmPassword: formData.get("confirmPassword"),
        })

        const plainPassword = user.password

        user.password = await hash(user.password)

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        })

        await signIn('credentials', {
            email: user.email,
            password: plainPassword
        })

        return {
            success: true,
            message: 'User registered successfully',
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            success: false,
            message: formatErrors(error),
        }
    }
}
