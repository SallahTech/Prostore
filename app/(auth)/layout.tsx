interface LayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({children}: Readonly<LayoutProps>) => {
    return (
        <div className={'flex-center min-h-screen w-full'}>
            {children}
        </div>
    );
}

export default AuthLayout;
