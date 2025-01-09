"use client";

import Head from 'next/head';
import NavBar from './app/Components/NavBar';
import MobNavBar from './app/Components/MoblieNav';
import Posts from './app/Components/Posts';
import dynamic from 'next/dynamic';

const NoSSR = dynamic(() =>
    import ('./Components/no-ssr'), { ssr: false });

const Page: React.FC = () => {
    return ( <
        >
        <
        Head >
        <
        link rel = "icon"
        type = "image/x-icon"
        href = "/favicon.ico" / >
        <
        /Head> <
        NavBar / >
        <
        MobNavBar / >
        <
        NoSSR >
        <
        Posts / >
        <
        /NoSSR> <
        />
    );
};

export default Page;