import Header from "@/components/shared/header";
import Footer from "@/components/footer";

const RootLayout = ({
                        children,
                    }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (

        <div className={'flex h-screen flex-col'}>
            <Header/>
            <main className={'flex-1 wrapper'}>
                {children}
            </main>
            <Footer/>
        </div>

    );
}

export default RootLayout;