import Script from "next/script";
import React from "react";

type HomeLayoutProps = {
    children: React.ReactNode
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <Script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js"/>
            </head>
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}

export default HomeLayout;