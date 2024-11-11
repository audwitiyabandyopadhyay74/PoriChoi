import Head from 'next/head';
import Favicon from './favicon.ico'
import NavBar from './Components/NavBar'
import Posts from './Components/Posts'

export default function Page ()   {
  return (
    <>
    <Head>
      <link rel='favicon' type='ico/pn' src={Favicon} />
    </Head>
<NavBar/>
<Posts/>
    </>
  )
}