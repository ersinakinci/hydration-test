import React from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';

// Replace with your Public API Key
builder.init('080513e0d5ae4bf78ed0b86e8ac876c6');

export async function getStaticProps({ params }: { params: any }) {
  // Fetch the builder content
  const [page, header] = await Promise.all([
    builder
      .get('page', {
        userAttributes: {
          urlPath: '/' + (params?.page?.join('/') || ''),
        },
      })
      .toPromise(),
    builder.get('header', { options: { noTargeting: true } }).toPromise(),
  ]);

  return {
    props: {
      page: page || null,
      header: header || null,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  // Get a list of all pages in builder
  const pages = await builder.getAll('page', {
    // We only need the URL field
    fields: 'data.url',
    options: { noTargeting: true },
  });

  return {
    paths: pages.map(page => `${page.data?.url}`),
    fallback: true,
  };
}

export default function Page({ page, header }: { page: any; header: any }) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{page?.data.title}</title>
      </Head>
      {/* Render the Builder page */}
      <BuilderComponent model="header" content={header} />
      <BuilderComponent model="page" content={page} />
    </>
  );
}
