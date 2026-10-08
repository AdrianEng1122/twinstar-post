async function test() {
  try {
    const res = await fetch("https://www.sinchew.com.my/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    console.log("Sin Chew Status:", res.status);
    const html = await res.text();
    console.log("Sin Chew HTML Length:", html.length);
    
    // Check article links
    const matches = html.match(/href="https:\/\/www\.sinchew\.com\.my\/\d{8}\/[^"]+"/g) || [];
    console.log("Matched Sin Chew date article links:", matches.slice(0, 5));
  } catch (e) {
    console.error("Sin Chew error:", e.message);
  }

  try {
    const res2 = await fetch("https://www.chinapress.com.my/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    console.log("China Press Status:", res2.status);
    const html2 = await res2.text();
    console.log("China Press HTML Length:", html2.length);
    const matches2 = html2.match(/href="https:\/\/www\.chinapress\.com\.my\/\d{8}\/[^"]+"/g) || [];
    console.log("Matched China Press date article links:", matches2.slice(0, 5));
  } catch (e) {
    console.error("China Press error:", e.message);
  }
}

test();
