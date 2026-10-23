const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWE0MjVkOWE5NWIxOWNlZWNmNWY3NjM0OTFhMTZhMiIsIm5iZiI6MTc4NjcwODk3NS45NDMsInN1YiI6IjZhN2YwM2VmYWRhZTA1MzllZWI3YTUwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tYWz-uha4q8nvwC1HTDd_KUgjGAdMFSPbOzZrkE3hoY";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("endpoint") || "";
    if (!path) {
      return new Response(JSON.stringify({ error: "Missing endpoint parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tmdbUrl = `https://api.themoviedb.org/3${path}`;
    const res = await fetch(tmdbUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, results: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
