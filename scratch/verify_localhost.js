async function test() {
  const res = await fetch('http://localhost:3000/viec-lam.html');
  const html = await res.text();
  console.log('Script tag:', (html.match(/src="js\/viec-lam\.js[^"]*"/) || [])[0]);
  console.log('CSS tag:', (html.match(/href="css\/viec-lam\.css[^"]*"/) || [])[0]);
  console.log('Critical CSS included:', html.includes('border-radius: 50% !important;'));
}

test();
