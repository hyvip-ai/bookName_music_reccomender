import Head from 'next/head';
import React from 'react';

function SEO() {
  return (
    <Head>
      <title>Reading Mood</title>
      <meta
        name='description'
        content='Gets songs depending on the book you are reading'
      />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
  );
}

export default SEO;
