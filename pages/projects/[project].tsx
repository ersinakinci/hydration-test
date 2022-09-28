import React from "react";
import { useRouter } from "next/router";
import {
  BuilderComponent,
  BuilderContent,
  builder,
  useIsPreviewing,
} from "@builder.io/react";
import DefaultErrorPage from "next/error";
import Head from "next/head";

// Replace with your Public API Key
builder.init("080513e0d5ae4bf78ed0b86e8ac876c6");

export async function getStaticProps({ params }: { params: any }) {
  // Fetch the builder content
  const [project, projectTemplate] = await Promise.all([
    builder
      .get("project", {
        userAttributes: {
          urlPath: "/projects/" + (params?.project || ""),
        },
      })
      .toPromise(),
    builder
      .get("project-template", { options: { noTargeting: true } })
      .toPromise(),
  ]);

  return {
    props: {
      project: project || null,
      projectTemplate: projectTemplate || null,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  // Get a list of all projects in builder
  const projects = await builder.getAll("project", {
    // We only need the URL field
    fields: "data.url",
    options: { noTargeting: true },
  });

  const paths = projects.map((project) => ({
    params: { project: `${project.data?.url.split("/")[2]}` },
  }));

  return {
    paths,
    fallback: true,
  };
}

export default function Page({
  project,
  projectTemplate,
}: {
  project: any;
  projectTemplate: any;
}) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if ((!project || !projectTemplate) && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{project?.data.title}</title>
      </Head>
      {/* Render the Builder page */}
      <BuilderContent model="project" content={project}>
        {(data) => (
          <BuilderComponent
            model="project-template"
            content={projectTemplate}
          />
        )}
      </BuilderContent>
    </>
  );
}
