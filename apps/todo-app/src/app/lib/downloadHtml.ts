export const downloadHtmlFile = (htmlString: string, type:string) => {
  // Step 1: Create a Blob from the HTML string
  const blob = new Blob([htmlString], { type: "text/html" });

  // Step 2: Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);

  const datetime = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  // Step 3: Create a temporary anchor element and trigger the download
  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.setAttribute("download", `${datetime}-${type}.html`); // Choose a filename here
  tempLink.click();

  // Clean up by revoking the Object URL
  window.URL.revokeObjectURL(url);
};
