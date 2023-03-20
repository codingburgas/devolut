import React from 'react';
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  AvatarBadge,
  Icon,
  Badge,
} from '@chakra-ui/react';
import Link from 'next/link';
import { AtSignIcon } from '@chakra-ui/icons';
import { Session } from 'next-auth';
import { NextRouter } from 'next/router';

const Header = ({ session, router, signOut }: {session: Session | null, router: NextRouter | null, signOut: any}) => {
  const AccountIcon = () => (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentcolor"
      aria-hidden="true"
      focusable="false"
      fontSize={'lg'}
      display={'block'}
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </Icon>
  );

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'space-between'}
      paddingTop={'5'}
      paddingBottom={'5'}
    >
      <Link href="/">
        <Text
          as={"h2"}
          fontFamily={'heading'}
          fontWeight={'bold'}
          fontSize={'3xl'}
          lineHeight={'1.33'}
          display={'flex'}
          alignItems={'flex-start'}
          width={'fit-content'}
        >
          Devolut<Badge marginLeft={"2"} fontWeight={"500"} fontSize={"sm"} colorScheme={"blue"}>v0.9</Badge>
        </Text>
      </Link>

      <Menu colorScheme={'gray'} placement={'bottom-end'}>
        <MenuButton>
          <Avatar src={'avatars/' + session?.user.avatarSrc} borderColor={'whiteAlpha.50'}>
            <AvatarBadge boxSize="20px" bg="green.400" borderColor={'#111'} />
          </Avatar>
        </MenuButton>
        <MenuList>
            <MenuItem icon={<AccountIcon/>} iconSpacing={'1'} onClick={() => router?.push('/account')} fontWeight={'500'}>Акаунт</MenuItem>
            <MenuItem icon={<AtSignIcon fontSize={'lg'} display={'block'}/>} command={"Изход"} iconSpacing={'1'} onClick={() => signOut()} fontWeight={'500'}>{session?.user.dTag}</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Header;
