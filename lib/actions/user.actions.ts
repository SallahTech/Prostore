"use server"

import {paymentMethodsSchema, shippingAddressSchema, signInFormSchema, signUserFormSchema} from "@/lib/validators";
import {auth, signIn, signOut} from '@/auth'

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {prisma} from "@/db/prisma";
import {formatErrors} from "@/lib/utils";
import {hash} from "@/lib/encryp";
import {ShippingAddress} from "@/types";
import {z} from "zod";

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

// get a user by the ID
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!user) throw new Error('User not found')

    return user
}

// update the user's address
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth()

        const currentUser = await prisma.user.findFirst({where: {id: session?.user?.id}})

        if (!currentUser) throw new Error('User not found')

        const address = shippingAddressSchema.parse(data)

        await prisma.user.update({
            where: {id: currentUser.id},
            data: {address}
        })

        return {
            success: true,
            message: "User updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

// Update users payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodsSchema>) {
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id}
        });

        if (!currentUser) throw new Error("User not found")

        const paymentMethod = paymentMethodsSchema.parse(data)

        await prisma.user.update({
            where: {id: currentUser.id},
            data: {paymentMethod: paymentMethod.type}
        })

        return {
            success: true,
            message: "User updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}
