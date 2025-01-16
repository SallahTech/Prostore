"use client"

import React from 'react';
import {CartItem} from "@/types";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {addItemToCart} from "@/lib/actions/cart.actions";
import {ToastAction} from "@/components/ui/toast";
import {Plus} from "lucide-react";

const AddToCart = ({item}: { item: CartItem }) => {
    const router = useRouter();
    const {toast} = useToast();

    const handleAddToCart = async () => {
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
            description: `${item.name} added to cart`,
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
    }

    return (
        <Button className={'w-full'} type={'button'} onClick={handleAddToCart}>
            <Plus/> Add to cart
        </Button>
    );
};

export default AddToCart;
