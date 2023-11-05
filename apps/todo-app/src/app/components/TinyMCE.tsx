import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMCE({
  onInit,
  initialValue,
}: {
  onInit: any;
  initialValue?: string;
}) {
  const openai_key = process.env.OPENAI_API_KEY;
  const tinymce_key = process.env.TINYMCE_API_KEY;

  return (
    <Editor
      apiKey={tinymce_key}
      onInit={onInit}
      init={{
        plugins:
          'insertdatetime ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste autocorrect a11ychecker typography inlinecss emoticons',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat | insertdatetime emoticons',
        insertdatetime_dateformat: '%d-%m-%Y',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => {
          const openAiOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openai_key}`,
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              temperature: 0.7,
              max_tokens: 800,
              messages: [{ role: 'user', content: request.prompt }],
            }),
          };
          respondWith.string((signal) =>
            window
              .fetch('https://api.openai.com/v1/chat/completions', {
                signal,
                ...openAiOptions,
              })
              .then((response) =>
                response.ok ? response.json() : response.text()
              )
              .then((data) => {
                console.log('data', data);
                if (typeof data === 'string') {
                  Promise.reject(
                    `Failed to communicate with the ChatGPT API. ${data}`
                  );
                } else if (data.error) {
                  Promise.reject(
                    `Failed to communicate with the ChatGPT API because of ${data.error.type} error: ${data.error.message}`
                  );
                } else {
                  // Extract the response content from the data returned by the API
                  return data?.choices[0]?.message?.content?.trim();
                }
              })
          );
        },
      }}
      initialValue={initialValue || 'Write something here...'}
    />
  );
}
