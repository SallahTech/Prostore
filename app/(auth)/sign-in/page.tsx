import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";
import CredentialsSignForm from "@/app/(auth)/sign-in/credentials-sign-form";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Sign In",
}

const SignPage = async () => {
    const session = await auth()

    if (session) return redirect("/");

    return (
        <div className={'w-full max-w-md mx-auto'}>
            <Card>
                <CardHeader className={'space-y-4'}>
                    <Link href="/" className={'flex-center'}>
                        <Image
                            src={'/images/logo.svg'}
                            alt={`${APP_NAME} logo`}
                            width={100}
                            height={10}
                            priority={true}
                        />
                    </Link>
                    <CardTitle className={'text-center'}>
                        Sign In
                    </CardTitle>
                    <CardDescription className={'text-center'}>
                        Sign in to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className={'space-y-4'}>
                    <CredentialsSignForm/>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignPage;
