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
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!session?.user.avatarSrc || session.user.avatarSrc == "") signOut();
  }, []);

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
        paddingInlineStart={{ base: '2', md: '8' }}
        paddingInlineEnd={{ base: '2', md: '8' }}
      >
        <Header session={session} router={router} signOut={signOut} />

        <Tabs onChange={(index) => setTabIndex(index)} isFitted colorScheme={'blue'}>
          <TabList>
            <Tab fontWeight={'semibold'}>Табло</Tab>
            <Tab isDisabled fontWeight={'semibold'}>Карти</Tab>
            <Tab isDisabled fontWeight={'semibold'}>Криптовалути</Tab>
            <Tab isDisabled fontWeight={'semibold'}>Сейфове</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {tabIndex == 0 ? (<Dashboard session={session}/>) : (<></>)}
            </TabPanel>
            <TabPanel>
              {tabIndex == 1 ? (<></>) : (<></>)}
            </TabPanel>
            <TabPanel>
              {tabIndex == 2 ? (<></>) : (<></>)}
            </TabPanel>
            <TabPanel>
              {tabIndex == 3 ? (<></>) : (<></>)}
            </TabPanel>
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