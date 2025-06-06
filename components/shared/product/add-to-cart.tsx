"use client"

import React, {useTransition} from 'react';
import {Cart, CartItem} from "@/types";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {addItemToCart, removeItemFromCart} from "@/lib/actions/cart.actions";
import {ToastAction} from "@/components/ui/toast";
import {Loader, Minus, Plus} from "lucide-react";

const AddToCart = ({item, cart}: { cart?: Cart; item: CartItem }) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const {toast} = useToast();

    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCart(item)

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message
                })

                return;
            }

            // Handle Success add to cart
            toast({
                description: res.message,
                action: (
                    <ToastAction
                        className={'bg-primary text-white hover:bg-gray-800'}
                        altText={'Go to cart'}
                        onClick={() => router.push('/cart')}
                    >
                        Go to cart
                    </ToastAction>
                )
            })
        })
    }

    // Remove from cart handler
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId)

            toast({
                variant: res.success ? 'default' : 'destructive',
                description: res.message
            })

            return
        })
    }

    // Check if item is in cart
    const existItem = cart && cart.items.find((x) => x.productId === item.productId)

    return (
        existItem ?
            (
                <div>
                    <Button
                        type={'button'}
                        variant={'outline'}
                        onClick={handleRemoveFromCart}
                    >
                        {
                            isPending ?
                                <Loader className={'w-4 h-4 animate-spin'}/>
                                :
                                <Minus className={'h-4 w-4'}/>
                        }
                    </Button>
                    <span className={'px-2'}>
                        {existItem.qty}
                    </span>
                    <Button
                        type={'button'}
                        variant={'outline'}
                        onClick={handleAddToCart}
                    >
                        {
                            isPending ?
                                <Loader className={'w-4 h-4 animate-spin'}/>
                                :
                                <Plus className={'h-4 w-4'}/>
                        }
                    </Button>
                </div>
            )
            :
            (<Button className={'w-full'} type={'button'} onClick={handleAddToCart}>

                {
                    isPending ?
                        <Loader className={'w-4 h-4 animate-spin'}/>
                        :
                        <Plus className={'h-4 w-4'}/>
                }{' '}
                Add to cart
            </Button>)
    );
};

export default AddToCart;
