import React, { useRef } from 'react';
import TinyMCE from '../../components/TinyMCE';
import { constructHtmlFile } from '../../lib/constructHtmlFile';
import { downloadHtmlFile } from '../../lib/downloadHtml';

export const Goals = () => {
  const title = 'Identify Your Goals';
  const description =
    "Identifying your goals is about creating a vision for what you want and providing yourself with a clear method to realize that vision. It's an ongoing, dynamic process that is central to personal growth and success.";

  const initialValue = `<ul class="tox-checklist">
<li>What goal do you want to achieve?</li>
</ul>
<p>If you achieved that...</p>
<ul class="tox-checklist">
<li>What do you want to achieve?</li>
<li>What would it be like?</li>
<li>What would you be saying to yourself?</li>
<li>How would this achievement influence other aspects of your life/work?</li>
<li>How would it feel?</li>
<li>What would others be saying?</li>
<li>What would your future look like?</li>
</ul>
<ul class="tox-checklist">
<li>If I could grant you one wish around your goal what would it be?</li>
<li>On a scale of one to ten, how important is this to you?</li>
<li>What is the possible outcome if you don&rsquo;t achieve what you want?</li>
<li>What needs to happen before you decide to do something about this situation?</li>
<li>When do you want to achieve this?</li>
<li>How will you measure progress towards your goal?</li>
<li>What is the first step you need to take?</li>
</ul>`;
  const editorRef = useRef(null);
  const download = () => {
    if (editorRef.current) {
      const htmlString = editorRef.current.getContent();
      downloadHtmlFile(constructHtmlFile(htmlString), 'goals', title);
      // try {
      //   fetch("/api/save_html", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ data: constructHtmlFile(htmlString).toString() }), // send the HTML data as a JSON payload
      //   })
      //     .then((response) => response.json())
      //     .then((data) => console.log(data));
      // } catch (error) {
      //   console.error("Error:", error);
      // }
    }
  };

  const onInit = (evt, editor) => (editorRef.current = editor);

  return (
    <>
      <div className="bg-gradient"></div>
      <div className="max-w-screen-md mx-auto w-full prose p-[10px]">
        <div className="grid sm:grid-cols-2 gap-2 mt-[16px]">
          <div className="card w-full w-90 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{title}</h2>
              <p>{description}</p>
            </div>
          </div>
        </div>
        <h4 className="text-white">What goal do you want to achieve?</h4>
        <TinyMCE onInit={onInit} initialValue={initialValue} />
        <button className="btn mt-4 btn-secondary" onClick={download}>
          Download Journal as HTML
        </button>
      </div>
      <footer className="footer p-10 bg-neutral text-neutral-content mt-[100px]">
        <nav>
          <header className="footer-title">Facets</header>
          <a
            className="link link-hover"
            href="https://facets.one"
            target="_blank"
            rel="noreferrer"
          >
            Website
          </a>
          <a
            className="link link-hover"
            href="https://facets.one/about"
            target="_blank"
            rel="noreferrer"
          >
            About Facets
          </a>
        </nav>
        <nav>
          <header className="footer-title">Resources</header>
          <a
            className="link link-hover"
            href="https://www.cnvc.org/learn/what-is-nvc"
          >
            Non Violent Communication
          </a>
          <a
            className="link link-hover"
            href="https://hbr.org/2016/11/3-ways-to-better-understand-your-emotions"
          >
            Harvard Business Review: 3 Ways To Better Understand Your Emotions
          </a>
        </nav>
      </footer>
    </>
  );
};

export default Goals;
