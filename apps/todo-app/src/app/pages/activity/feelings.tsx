import React, { useRef, useState } from 'react';
import parse from 'html-react-parser';
import { FEELINGS, SIMILAR_FEELINGS } from '../../lib/nonviolentcommunication';
import TinyMCE from '../../components/TinyMCE';
import { downloadHtmlFile } from '../../lib/downloadHtml';
import { constructHtmlFile } from '../../lib/constructHtmlFile';

function Dashboard() {
  const title = 'Identify Your Feelings';
  const q1 = 'What happened?';
  const q2 = 'What would you do differently now?';
  const EDIT_STATES = {
    Q1: 0,
    Q2: 1,
    DONE: 2,
  };
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [editQuestion, setEditQuestion] = useState(EDIT_STATES.Q1);
  const [isDone, setIsDone] = useState(false);
  const [initialValue, setInitialValue] = useState('');

  const now = new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const [selectedFeeling, setSelectedFeeling] = useState<{
    [key: string]: {
      feeling: string;
      selected: boolean;
      sad: boolean;
      emoji: string;
    };
  }>({});

  const options = Object.values(FEELINGS.MET);
  const unmet_options = Object.values(FEELINGS.NOT_MET);
  const selectedArray = Object.values(selectedFeeling);

  const onSelectFeeling = (feeling, emoji, sad) => {
    setSelectedFeeling(
      Object.assign({}, selectedFeeling, {
        [feeling]: {
          selected: !selectedFeeling[feeling]?.selected,
          emoji,
          sad,
          feeling,
        },
      })
    );
  };

  const editorRef = useRef(null);
  const download = () => {
    if (editorRef.current) {
      let htmlString = '';
      selectedArray.forEach(({ feeling, selected, sad, emoji }) => {
        const className = `badge ${sad ? 'badge-neutral' : ''}`;
        if (selected) {
          htmlString += `<div class="${className}">${emoji} ${feeling}</div>`;
        }
      });
      console.log(htmlString);
      if (isDone) {
        htmlString += `<h2>${q1}</h2>${answer1}<h2>${q2}</h2>${answer2}`;
      } else {
        const currentText = editorRef.current.getContent();
        if (editQuestion === EDIT_STATES.Q2) {
          htmlString += `<h2>${q1}</h2>${answer1}<h2>${q2}</h2>${currentText}`;
        } else {
          htmlString += `<h2>${q1}</h2>${currentText}`;
          if (answer2) {
            htmlString += `<h2>${q2}</h2>${answer2}`;
          }
        }
      }

      downloadHtmlFile(constructHtmlFile(htmlString, title), 'feelings');
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
  const next = () => {
    if (editorRef.current) {
      const htmlString = editorRef.current.getContent();
      setAnswer1(htmlString);

      setEditQuestion(EDIT_STATES.Q2);
      editorRef.current.setContent(answer2);
    }
  };

  const submit = () => {
    if (editorRef.current) {
      if (editQuestion === EDIT_STATES.Q1) {
        const htmlString = editorRef.current.getContent();
        setAnswer1(htmlString);
      }
      if (editQuestion === EDIT_STATES.Q2) {
        const htmlString = editorRef.current.getContent();
        setAnswer2(htmlString);

        setEditQuestion(EDIT_STATES.Q1);
        editorRef.current.setContent(answer1);
      }
      setEditQuestion(EDIT_STATES.DONE);
    }
  };

  const back = () => {
    setIsDone(false);

    if (editorRef.current) {
      if (editQuestion === EDIT_STATES.Q1) {
        const htmlString = editorRef.current.getContent();
        setAnswer1(htmlString);
      }
      if (editQuestion === EDIT_STATES.Q2) {
        const htmlString = editorRef.current.getContent();
        setAnswer2(htmlString);

        setEditQuestion(EDIT_STATES.Q1);
        editorRef.current.setContent(answer1);
      }
      if (editQuestion === EDIT_STATES.DONE) {
        console.log(answer2);
        setEditQuestion(EDIT_STATES.Q2);
        setInitialValue(answer2);
        editorRef.current.setContent(answer2);
      }
    }
  };

  const onInit = (evt, editor) => (editorRef.current = editor);

  return (
    <div>
      <div className="bg-gradient"></div>
      <div className="max-w-screen-md mx-auto w-full prose p-[10px]">
        <div className="grid sm:grid-cols-2 gap-2 mt-[16px]">
          <div className="card w-full w-90 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Identify Your Feelings</h2>
              <p>
                Identifying your feelings is important for emotional regulation.
                When you can express yourself, it allows for deeper emotional
                connections with others.
              </p>
            </div>
          </div>
          <div>
            {selectedArray.map(({ feeling, selected, sad, emoji }) => {
              return (
                selected && (
                  <div
                    className={`badge${sad ? ' badge-neutral' : ''}`}
                    key={feeling}
                  >
                    {emoji} {feeling}
                  </div>
                )
              );
            })}
          </div>
        </div>
        <h4 className="text-white">Select what you&rsquo;re feeling</h4>
        <div className="collapse bg-white">
          <input type="radio" name="feeling-accordion" />
          <div className="collapse-title text-xl font-medium">
            When your needs feel met
          </div>
          <div className="collapse-content bg-zinc-200">
            <div className="grid sm:grid-cols-3 gap-2 mt-[16px]">
              {options &&
                options.map(({ id, name, emoji }) => (
                  <div key={id} className="flex flex-col items-center">
                    <div className="collapse bg-white">
                      <input type="radio" name="met-accordion" />
                      <div className="collapse-title">
                        <div className="text-3xl border-white">
                          {emoji}{' '}
                          <span className="text-base text-center leading-2">
                            {name}
                          </span>
                        </div>
                      </div>
                      <div className="collapse-content bg-white">
                        {SIMILAR_FEELINGS[id] &&
                          SIMILAR_FEELINGS[id].map((feeling) => (
                            <button
                              key={feeling}
                              className={`btn btn-xs ${
                                selectedFeeling[feeling] &&
                                'btn-active btn-primary'
                              }`}
                              onClick={() => {
                                onSelectFeeling(feeling, emoji, false);
                              }}
                            >
                              {feeling}
                              {selectedFeeling[feeling] && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="collapse bg-white">
          <input type="radio" name="feeling-accordion" />
          <div className="collapse-title text-xl font-medium">
            When your needs aren&rsquo;t met
          </div>
          <div className="collapse-content bg-zinc-200">
            <div className="grid sm:grid-cols-3 gap-2 mt-[16px]">
              {unmet_options &&
                unmet_options.map(({ id, name, emoji }) => (
                  <div key={id} className="flex flex-col items-center">
                    {' '}
                    {/* Adjusted classes here */}
                    <div className="collapse bg-white">
                      <input type="radio" name="unmet-accordion" />
                      <div className="collapse-title">
                        <div className="text-3xl border-white">
                          {emoji}{' '}
                          <span className="text-base text-center leading-2">
                            {name}
                          </span>
                        </div>
                      </div>
                      <div className="collapse-content bg-white">
                        {SIMILAR_FEELINGS[id] &&
                          SIMILAR_FEELINGS[id].map((feeling) => (
                            <button
                              key={feeling}
                              className={`btn btn-xs ${
                                selectedFeeling[feeling] &&
                                'btn-active btn-primary'
                              }`}
                              onClick={() => {
                                onSelectFeeling(feeling, emoji, true);
                              }}
                            >
                              {feeling}
                              {selectedFeeling[feeling] && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="w-full text-center"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <h4 className="text-white">What happened?</h4>
        <div className="text-white pl-[20px]">
          {editQuestion !== EDIT_STATES.Q1 && parse(answer1)}
        </div>
        {editQuestion !== EDIT_STATES.Q1 && (
          <h4 className="text-white">What would you do differently now?</h4>
        )}
        {editQuestion === EDIT_STATES.DONE && answer2 && (
          <div className="text-white pl-[20px]">{parse(answer2)}</div>
        )}
        {editQuestion !== EDIT_STATES.DONE && (
          <TinyMCE onInit={onInit} initialValue={initialValue} />
        )}
        {editQuestion === EDIT_STATES.Q1 && (
          <button className="btn mt-4 mr-1 btn-secondary" onClick={next}>
            Next
          </button>
        )}
        {editQuestion !== EDIT_STATES.Q1 && (
          <button className="btn mt-4 mr-1 btn-secondary" onClick={back}>
            Back
          </button>
        )}
        {editQuestion !== EDIT_STATES.DONE && (
          <button className="btn mt-4 mr-1 btn-secondary" onClick={submit}>
            Submit
          </button>
        )}
        <button className="btn mt-4 btn-secondary" onClick={download}>
          Download as HTML
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
    </div>
  );
}

export default Dashboard;
