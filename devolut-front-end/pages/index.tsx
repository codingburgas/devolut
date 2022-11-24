import { getSession, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <button onClick={() => signOut()}>Sign out</button>
  );
}

export async function getServerSideProps({ req }){
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