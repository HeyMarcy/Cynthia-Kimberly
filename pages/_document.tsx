import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='icon' href='/favicon.ico' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700&display=swap'
            rel='stylesheet'
          />
          <meta
            name='description'
            content='Icon Gallery Viewing Room'
          />
   
          <meta property='og:title' content='Icon Gallery Viewing Room' />
        </Head>
        <body className='bg-black antialiased'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
