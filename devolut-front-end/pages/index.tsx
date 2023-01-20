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
import Header from "../components/header";
import Footer from "../components/footer";
import { useRouter } from "next/router";
import { IncomingMessage } from "http";
import Dashboard from "../components/dashboard";
import Head from "next/head";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Devolut</title>
      </Head>

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
            <Tab fontWeight={'semibold'}>Табло</Tab>
            <Tab isDisabled fontWeight={'semibold'}>Карти</Tab>
            <Tab isDisabled fontWeight={'semibold'}>Криптовалути</Tab>
            <Tab isDisabled fontWeight={'semibold'}>Сейфове</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><Dashboard session={session}/></TabPanel>
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