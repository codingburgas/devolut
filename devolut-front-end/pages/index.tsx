import { getSession, signOut, useSession } from "next-auth/react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ScaleFade,
} from '@chakra-ui/react';
import Header from "./header";
import Footer from "./footer";
import { useRouter } from "next/router";
import { IncomingMessage } from "http";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <ScaleFade initialScale={0.9} in={true}>
      <Box
        width={'full'}
        maxWidth={{ base: 'xl', md: '7xl' }}
        marginInline={'auto'}
        paddingInlineStart={{ base: '6', md: '8' }}
        paddingInlineEnd={{ base: '6', md: '8' }}
      >
        <Header session={session} router={router} signOut={signOut} />

        <Tabs isFitted colorScheme={'blue'}>
          <TabList>
            <Tab fontWeight={'semibold'}>Dashboard</Tab>
            <Tab fontWeight={'semibold'}>Cards</Tab>
            <Tab fontWeight={'semibold'}>Crypto</Tab>
            <Tab fontWeight={'semibold'}>Vaults</Tab>
          </TabList>
          <TabPanels>
            <TabPanel></TabPanel>
            <TabPanel></TabPanel>
            <TabPanel></TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>

        <Footer />
      </Box>
    </ScaleFade>
    </>
  );
}

export async function getServerSideProps({ req }: {req: IncomingMessage}){
  const session = await getSession({ req })

  if(!session){
    return {
      redirect : {
        destination: '/sign-in',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}