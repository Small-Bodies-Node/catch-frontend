const main = async () => {
  console.log('Working?');
  const res = await fetch('http://localhost:4000/api/horizons', {
    // const res = await fetch('https://catch-dev.astro.umd.edu/api/horizons', {
    method: 'POST',
    body: JSON.stringify({
      horizons_url:
        "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='DES=65P%3BCAP%3B'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&OUT_UNITS='AU-D'&EPHEM_TYPE='ELEMENTS'&CENTER=@ssb&TLIST=2455339.95748 2455338.95748",
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const x = await res.text();

  console.log(x);
};

main();
