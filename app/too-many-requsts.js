import Link from "next/link";

const TooManyRequests = () => {
  return (
    <div class="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
  <div class="rounded-lg bg-white p-8 text-center shadow-xl">
    <h1 class="mb-4 text-4xl font-bold">429</h1>
    <p class="text-gray-600">Too Many Requests Error.</p>
    <a href="/" class="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"> Go back to Home </a>
  </div>
</div>
    /*
    <main
      className="text-center"
      style={{
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "28px",
        }}
      >
        Sorry, the page you requested could not be found
      </h1>
      <h4 style={{ fontSize: "24px", color: "purple" }}>
        you can add antyhing here with your own styles and languages as i
        mentioned in the article.
      </h4>
      <p style={{ fontSize: "20px" }}>
        please visit <Link href={"/"}>Home page</Link>
      </p>
    </main>
    */
  );
};
export default TooManyRequests;
