import React, { Component, useRef } from 'react';
import TinyMCE from '../../components/TinyMCE';
import { constructHtmlFile } from '../../lib/constructHtmlFile';
import { downloadHtmlFile } from '../../lib/downloadHtml';

export const Values = () => {
  const title = 'Identify Your Values';
  const description =
    'By answering these questions honestly and thoughtfully, you start to see patterns in what you enjoy, care about, and stand for. These are your core values. It might be helpful to write down your responses and then look for recurring themes and words. From these, you can create a list of values that you hold most dear.';
  const initialValue = `<ul class="tox-checklist">
<li><p><strong>Reflect on Happiness</strong>: When have you been happiest in your life? What were you doing, and what elements contributed to your happiness?</p></li><li><p><strong>Peak Experiences</strong>: Think about your most rewarding experiences. What made them so? What were you doing, and what aspects of those situations are noteworthy?</p></li><li><p><strong>Admiration Insights</strong>: Who do you admire most? What qualities do these people possess that you respect? Can you see any patterns that point toward values?</p></li><li><p><strong>Challenges and Persistence</strong>: Recall a time when you faced challenges and persevered. What was the driving force that kept you going? Why did that matter to you?</p></li><li><p><strong>Joy in Activity</strong>: What activities cause you to lose track of time? What are you doing when you feel most alive, and what does this suggest about your values?</p></li><li><p><strong>Life Review</strong>: If you were to describe your ideal life, what would it look like? What elements are present, and what values are you honoring in this life?</p></li><li><p><strong>Regrets and Changes</strong>: Are there any regrets you have or things you would do differently if given a chance? What does this tell you about what is important to you?</p></li><li><p><strong>Contribution and Impact</strong>: How do you most enjoy helping others? What change would you most like to make in the world?</p></li><li><p><strong>Non-negotiables</strong>: What would you never compromise on, no matter the situation? What crosses a moral line for you?</p></li><li><p><strong>Energy Drivers</strong>: What topics make you excited to talk about for hours, defend, or debate?</p></li><li><p><strong>Legacy Creation</strong>: What do you want to be remembered for after you're gone? What legacy do you want to leave?</p></li><li><p><strong>Resource Allocation</strong>: Where do you spend your time and money effortlessly? What priorities does this reveal?</p></li><li><p><strong>Emotional Triggers</strong>: What situations or actions make you truly upset or deeply happy? What values are being challenged or honored in those situations?</p></li><li><p><strong>Decision Reflection</strong>: Think about a decision you made that you felt good about. What about that decision was satisfying? What values were you honoring?</p></li><li><p><strong>Values in Others</strong>: What traits or behaviors do you consistently promote or try to instill in others, especially younger generations?</p></li>
</ul>`;
  const editorRef = useRef(null);
  const download = () => {
    if (editorRef.current) {
      const htmlString = editorRef.current.getContent();
      downloadHtmlFile(constructHtmlFile(htmlString));
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
        <h4 className="text-white">
          Choose some of the following ways to help you indentify your goals
        </h4>
        {/* <TinyMCE onInit={onInit} initialValue={initialValue} /> */}
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

export default Values;
