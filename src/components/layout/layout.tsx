import { theme, useTheme } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { slide as Menu, Styles } from 'react-burger-menu';

import styles from '@/styles/Home.module.css';

import Header from '../parts/header';

let bgstyles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '36px',
        height: '30px',
        left: '36px',
        top: '36px',
    },
    bmBurgerBars: {
        background: theme.colors.black,
    },
    bmBurgerBarsHover: {
        background: '#a90000',
    },

    bmCrossButton: {
        height: '24px',
        width: '24px',
    },
    bmCross: {
        background: '#bdc3c7',
    },
    bmMenuWrap: {
        position: 'fixed',
        height: '100%',
    },
    bmMenu: {
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em',
    },
    bmMorphShape: {
        fill: '#373a47',
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
    },
    bmItem: {
        // display: 'inline-block'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)',
    },
};

export default function Layout({ children }: any) {
    const [isServer, setIsServer] = useState(true);
    const [marginLeftNumber, setmarginLeftNumber] = useState('0px');
    const [menuOpen, setMenuOpen] = useState(false);
    // console.log(theme.colors)
    // console.log(bgstyles)
    useEffect(() => {
        setIsServer(typeof window === 'undefined');
        console.log('ClientSide: isServer', isServer);
    }, []);
    function handleOnOpen(): void {
        setmarginLeftNumber('300px');
        setMenuOpen(true);
    }

    function handleOnClose(): void {
        setmarginLeftNumber('0px');
        setMenuOpen(false);
    }

    return (
        <div id="outer-container">
            {!isServer && (
                <Menu
                    noOverlay
                    noTransition
                    className="bm-menu-wrap"
                    pageWrapId={'page-wrap'}
                    outerContainerId={'outer-container'}
                    onOpen={handleOnOpen}
                    onClose={handleOnClose}
                    isOpen={menuOpen}
                    // styles={bgstyles as Partial<Styles>}
                >
                    {/* <Link id="home" className="menu-item" href="/">
            Home
          </Link> */}
                    <Link
                        id="dashboard"
                        className="menu-item"
                        href="/dashboard"
                    >
                        Dashboard
                    </Link>

                    {/* <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a> */}
                </Menu>
            )}
            <Header marginLeftNumber={marginLeftNumber} />
            <main
                id="page-wrap"
                className={styles.main}
                style={{ marginLeft: marginLeftNumber }}
            >
                {children}
            </main>
        </div>
    );
}
