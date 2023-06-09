import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { ReactNode } from 'react';

import { userSessionAtom } from '@/jotai/atom';
import { t } from '@/translation';

// import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Links = [{ link: '/dashboard', name: 'Dashboard' }];

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={href}
    >
        {children}
    </Link>
);

export default function Header(props: { marginLeftNumber: string }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [user, setUser] = useAtom(userSessionAtom);

    return (
        <Box
            style={{
                marginLeft: props.marginLeftNumber,
                height: String(36 * 3) + 'px',
            }}
        >
            <Box
                bg={useColorModeValue('gray.100', 'gray.900')}
                px={4}
                height={'100%'}
            >
                <Flex
                    h={'100%'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <IconButton
                        size={'md'}
                        // icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack
                        marginLeft={36 * 3 + 'px'}
                        spacing={8}
                        alignItems={'center'}
                    >
                        {/* <Box>Logo</Box> */}
                        {/* <Input placeholder="search"></Input> */}
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}
                        >
                            {Links.map((link) => (
                                <NavLink key={link.name} href={link.link}>
                                    {link.name}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                {/* <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                /> */}
                                menu
                            </MenuButton>
                            <MenuList>
                                <MenuItem
                                    onClick={() => {
                                        setUser('logout');
                                        console.log('logout');
                                    }}
                                    as="a"
                                    href="/login"
                                >
                                    {t('logout')}
                                </MenuItem>
                                {/* <MenuItem>Link 2</MenuItem>
                                <MenuDivider />
                                <MenuItem>Link 3</MenuItem> */}
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}
