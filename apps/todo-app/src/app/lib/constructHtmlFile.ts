import moment from 'moment';
export const constructHtmlFile = (html: string, title: string) => {
  const date = moment();

  // Format the date
  const formattedDate = date.format('dddd, MMMM D, YYYY');

  const htmlCode = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>${formattedDate}</title>
      <style>
      .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
          transition-duration: 200ms;
          height: 1.25rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          width: -moz-fit-content;
          width: fit-content;
          padding-left: 0.563rem;
          padding-right: 0.563rem;
          border-width: 1px;
          --tw-border-opacity: 1;
          border-color: hsl(var(--b2) / var(--tw-border-opacity));
          --tw-bg-opacity: 1;
          background-color: hsl(var(--b1) / var(--tw-bg-opacity));
          --tw-text-opacity: 1;
          color: hsl(var(--bc) / var(--tw-text-opacity));
          border-radius: var(--rounded-badge, 1.9rem);
        }
        .badge-neutral {
          --tw-border-opacity: 1;
          border-color: hsl(var(--n) / var(--tw-border-opacity));
          --tw-bg-opacity: 1;
          background-color: hsl(var(--n) / var(--tw-bg-opacity));
          --tw-text-opacity: 1;
          color: hsl(var(--nc) / var(--tw-text-opacity));
        }
      </style>
  </head>
  <body>
      <h1>${title}</h1>
      <p>${formattedDate}</p>
      ${html}
  </body>
  </html>
  `;
  return htmlCode;
};
