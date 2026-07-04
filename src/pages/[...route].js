import { getHtmlPages, outputPathFromRoute, readHtmlByRoute } from "../lib/legacy-pages.mjs";

export function getStaticPaths() {
  return getHtmlPages().map((page) => ({
    params: { route: outputPathFromRoute(page.route) },
    props: { route: page.route }
  }));
}

export function GET({ props }) {
  return new Response(readHtmlByRoute(props.route), {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
