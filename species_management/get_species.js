import React, { useEffect, useState } from "https://esm.sh/react@18";
import ReactDOM from "https://esm.sh/react-dom@18/client";

const INAT_API = "https://api.inaturalist.org/v1";

const areaToRadiusKm = (areaKm2) => Math.sqrt(areaKm2 / Math.PI);

async function fetchAllPages(params) {
  const results = [];
  const perPage = 200;

  for (let page = 1; page <= 10; page++) {
    const q = new URLSearchParams({
      ...params,
      per_page: perPage,
      page,
    });

    const res = await fetch(
      `${INAT_API}/observations/species_counts?${q}`
    );
    const json = await res.json();

    results.push(...(json.results || []));

    if (page * perPage >= (json.total_results || 0)) break;
  }

  return results;
}

function App() {
  const [threatened, setThreatened] = useState([]);
  const [nonNative, setNonNative] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const lat = 59.9139;
      const lng = 10.7522;
      const radius = areaToRadiusKm(10);

      const base = {
        lat,
        lng,
        radius,
        quality_grade: "research",
      };

      const threatenedRows = await fetchAllPages({
        ...base,
        threatened: "true",
      });

      const introducedRows = await fetchAllPages({
        ...base,
        introduced: "true",
      });

      const normalize = (r) =>
        r.taxon?.preferred_common_name ||
        r.taxon?.default_name?.name ||
        r.taxon?.name;

      setThreatened(
        [...new Set(threatenedRows.map(normalize).filter(Boolean))].sort()
      );

      setNonNative(
        [...new Set(introducedRows.map(normalize).filter(Boolean))].sort()
      );

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return React.createElement("div", null, "Loading...");

  return React.createElement(
    "div",
    { style: { fontFamily: "sans-serif", padding: "20px" } },
    React.createElement("h2", null, "Threatened species"),
    React.createElement(
      "ul",
      null,
      threatened.map((n) =>
        React.createElement("li", { key: n }, n)
      )
    ),
    React.createElement("h2", { style: { marginTop: "40px" } }, "Non-native species"),
    React.createElement(
      "ul",
      null,
      nonNative.map((n) =>
        React.createElement("li", { key: n }, n)
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));